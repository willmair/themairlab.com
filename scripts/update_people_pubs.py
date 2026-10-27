"""Refresh assets/js/people_pubs.js: the publication list on each lab member's and alum's profile page.

Usage:  python3 scripts/update_people_pubs.py      (run after update_pubs.py)

Each page lists:
  - MAIR Lab papers: entries in assets/js/pubs.js (CV-gated) with the person among
    the authors. A name match ("Sharma A") only counts if PubMed gives the same first
    name ("Arpit"), so a different A. Sharma on a collaborative paper is never picked up.
    New lab papers appear automatically.
  - CV_EXTRA: CV items that are not on PubMed (some preprints, a book chapter).
  - Current members only: their papers from before or outside the lab, found by a
    PubMed name search. Name searches pick up other people with the same name, so a
    paper is only shown once its PMID is in that person's CONFIRMED set. New hits go
    to scripts/pending_people_pubs.json for review in the weekly briefing: add the
    PMID to CONFIRMED if it is theirs, or to EXCLUDE if it is someone else's.
    Alumni pages list MAIR Lab papers only.

A person with a page needs an entry in PEOPLE (slug = pages/people/<slug>.html).
"""
import json, pathlib, time, unicodedata, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "js" / "people_pubs.js"
PENDING = ROOT / "scripts" / "pending_people_pubs.json"
LAB = ROOT / "assets" / "js" / "pubs.js"

# slug: (first name as on PubMed, author names as in pubs.js)
PEOPLE = {
    # current members
    "anne-lanjuin": ("Anne", ["Lanjuin A"]),
    "aditi-prabhakar": ("Aditi", ["Prabhakar A"]),
    "christopher-morrow": ("Christopher", ["Morrow CS"]),
    "jamie-kraft": ("Jamie", ["Kraft JD"]),
    "emily-levesque": ("Emily", ["Levesque E"]),
    "kate-roh": ("Younjoo", ["Roh Y", "Roh K"]),
    # alumni with MAIR Lab papers or preprints
    "miriam-valera-alberni": ("Miriam", ["Valera-Alberni M"]),
    "laura-wester": ("Laura", ["Wester LE"]),
    "arpit-sharma": ("Arpit", ["Sharma A"]),
    "vanessa-laversenne": ("Vanessa", ["Laversenne V"]),
    "carlos-silva-garcia": ("Carlos", ["Silva-García CG"]),
    "malini-bhadra": ("Malini", ["Bhadra M"]),
    "porsha-howell": ("Porsha", ["Howell P"]),
    "suvagata-roy-chowdhury": ("Suvagata", ["Chowdhury SR"]),
    "heather-weir": ("Heather", ["Weir HJ", "Weir HJM"]),
    "caroline-heintz": ("Caroline", ["Heintz C"]),
    "kristopher-burkewitz": ("Kristopher", ["Burkewitz K"]),
    "maria-perez-matos": ("Maria", ["Perez-Matos MC", "Perez Matos MC"]),
    "hannah-smith": ("Hannah", ["Smith H", "Smith HJ"]),
    "ewelina-nowak": ("Ewelina", ["Nowak E"]),
    "pallas-yao": ("Pallas", ["Yao P"]),
    "sneha-dutta": ("Sneha", ["Dutta S"]),
    "caroline-escoubas": ("Caroline", ["Escoubas CC", "Escoubas C"]),
    "yue-zhang": ("Yue", ["Zhang Y"]),
    "peter-stine": ("Peter", ["Stine PG"]),
    "ianessa-morantte": ("Ianessa", ["Morantte I"]),
    "rohan-sehgal": ("Rohan", ["Sehgal R"]),
    "emina-tabakovic": ("Emina", ["Tabakovic E"]),
    "nicole-clark": ("Nicole", ["Clark NM", "Clark N"]),
    "lourdes-pajuelo": ("Lourdes", ["Pajuelo Torres L", "Pajuelo L"]),
    "raymond-laboy-morales": ("Raymond", ["Laboy R"]),
}

# In the CV but not on PubMed. Matched to people by author name like any lab paper.
CV_EXTRA = [
    {"pmid": "", "year": 2022, "title": "Confirming the pro-longevity effects of H3K4me3-deficient set-2 mutants in extending lifespan in C. elegans",
     "authors": ["Silva-García CG", "Mair WB"], "journal": "bioRxiv", "doi": "10.1101/2022.08.02.502497", "kind": "preprint"},
    {"pmid": "", "year": 2020, "title": "AMPK modulates associative learning via neuronal mitochondrial fusion in C. elegans",
     "authors": ["Escoubas CC", "Laversenne V", "Tabakovic E", "Weir HJ", "Clark N", "Mair WB"], "journal": "bioRxiv",
     "doi": "10.1101/2020.11.05.370031", "kind": "preprint"},
    {"pmid": "", "year": 2016, "title": "Dietary restriction in C. elegans",
     "authors": ["Zhang Y", "Mair WB"], "journal": "Springer (book chapter)", "doi": "10.1007/978-3-319-44703-2_16", "kind": "review"},
]

# Current members' papers from outside the lab: PubMed query, confirmed PMIDs, excluded PMIDs
OUTSIDE = {
    "anne-lanjuin": {
        "query": '"Lanjuin, Anne"[FAU] OR 0000-0003-2532-0863[auid]',
        # Brandeis (C. elegans sensory neurons) and Harvard MCB
        "confirmed": {"11832225", "14536063", "15018934", "16376329", "17510633", "23685720", "29231812"},
        "exclude": set(),
    },
    "aditi-prabhakar": {
        "query": '"Prabhakar, Aditi"[FAU] OR 0000-0002-6024-4600[auid]',
        # University at Buffalo (Cullen lab, yeast MAPK signaling)
        "confirmed": {"27001830", "30096860", "30842272", "31452924", "31710471", "32079658", "34347092",
                      "36909494", "37774975"},
        "exclude": {"34916515"},  # author correction
    },
    "christopher-morrow": {
        "query": '"Morrow, Christopher S"[FAU] OR "Morrow, Christopher"[FAU]',
        # University of Wisconsin-Madison (Moore lab, neural stem cells)
        "confirmed": {"30849364", "32109376", "33190414", "34430917", "34714522", "36056070", "37292613",
                      "38521057", "38682901", "40684436"},
        # other Christopher Morrows (AstraZeneca oncology, Johns Hopkins psychiatry, Curtin, pediatrics)
        "exclude": {"22006676", "23416181", "27490725", "27986707", "30424958", "34866317", "38470011",
                    "38835997", "39838223", "40453827", "40554402", "41186491", "41985110", "42442380",
                    "42724567"},
    },
    "jamie-kraft": {
        "query": '"Kraft, Jamie D"[FAU] OR "Kraft, Jamie"[FAU] OR 0000-0001-6336-9997[auid]',
        # University of Gothenburg (Wallenberg Laboratory)
        "confirmed": {"33801198", "33803130", "34022871", "34204944", "35104001", "35789845", "37532933",
                      "37658064"},
        "exclude": set(),
    },
    "emily-levesque": {"query": '"Levesque, Emily"[FAU]', "confirmed": set(), "exclude": set()},
    "kate-roh": {"query": '"Roh, Younjoo"[FAU] OR "Roh, Kate"[FAU]', "confirmed": set(), "exclude": set()},
}


def get(endpoint, raw=False, **params):
    params = dict(params, db="pubmed") if raw else dict(params, db="pubmed", retmode="json")
    url = EUTILS + endpoint + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=90) as r:
        out = r.read() if raw else json.load(r)
    time.sleep(0.4)  # NCBI asks for at most 3 requests a second without an API key
    return out


def fold(s):
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()


def entry(pmid, r):
    types = r.get("pubtype", [])
    doi = next((a["value"] for a in r.get("articleids", []) if a["idtype"] == "doi"), "")
    return {
        "pmid": pmid,
        "year": int(r["pubdate"][:4]),
        "title": r["title"].rstrip("."),
        "authors": [a["name"] for a in r["authors"]],
        "journal": r["source"],
        "doi": doi,
        "kind": "preprint" if r["source"] in ("bioRxiv", "medRxiv") or "Preprint" in types else (
            "review" if "Review" in types else "commentary" if {"Comment", "Editorial"} & set(types) else "article"),
    }


lab_text = LAB.read_text()
lab = json.loads(lab_text[lab_text.index("["):lab_text.rindex("]") + 1])

# full first names on each lab paper, to tell e.g. Arpit Sharma from another A. Sharma
forenames = {}
xml = ET.fromstring(get("efetch.fcgi", raw=True, id=",".join(p["pmid"] for p in lab), retmode="xml"))
for art in xml.iter("PubmedArticle"):
    forenames[art.findtext(".//PMID")] = {
        (fold(a.findtext("LastName")), fold(a.findtext("ForeName"))) for a in art.iter("Author")}


def is_them(paper, slug):
    first, names = PEOPLE[slug]
    name = next((n for n in names if n in paper["authors"]), None)
    if not name:
        return False
    if paper["pmid"] not in forenames:  # CV_EXTRA: no PubMed record, trust the CV
        return True
    last = fold(name.rsplit(" ", 1)[0])
    return any(ln == last and fn.startswith(fold(first)) for ln, fn in forenames[paper["pmid"]])


shown, pending = {}, []
for slug, (first, names) in PEOPLE.items():
    papers = [dict(p, lab=True) for p in lab + CV_EXTRA if is_them(p, slug)]
    m = OUTSIDE.get(slug)
    if m:
        lab_ids = {p["pmid"] for p in lab}
        ids = get("esearch.fcgi", term=m["query"], retmax=500)["esearchresult"]["idlist"]
        ids = [i for i in ids if i not in lab_ids and i not in m["exclude"]]
        summary = get("esummary.fcgi", id=",".join(ids))["result"] if ids else {"uids": []}
        for pmid in summary["uids"]:
            r = summary[pmid]
            if {"Erratum", "Published Erratum"} & set(r.get("pubtype", [])):
                continue
            e = entry(pmid, r)
            if pmid in m["confirmed"]:
                papers.append(e)
            elif not any(a.startswith("Mair W") for a in e["authors"]):  # lab papers not in the CV are update_pubs.py's job
                pending.append(dict(e, member=slug))
    papers.sort(key=lambda p: (-p["year"], p["title"]))
    shown[slug] = {"names": names, "papers": papers}

OUT.write_text("// Generated by scripts/update_people_pubs.py — do not edit by hand.\n"
               "window.PEOPLE_PUBS = " + json.dumps(shown, ensure_ascii=False, indent=1) + ";\n")
PENDING.write_text(json.dumps(pending, ensure_ascii=False, indent=1) + "\n")
for slug, s in shown.items():
    n_lab = sum(1 for p in s["papers"] if p.get("lab"))
    print(f"{slug}: {n_lab} MAIR Lab, {len(s['papers']) - n_lab} other")
print(f"{len(pending)} unconfirmed PubMed record(s) -> {PENDING.name} for review")
for p in pending:
    print(f"  PENDING {p['member']} {p['pmid']} {p['year']} {p['journal']}: {p['title'][:80]} ({', '.join(p['authors'][:4])} ...)")
