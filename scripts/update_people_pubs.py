"""Refresh assets/js/people_pubs.js: the publication list on each lab member's and alum's profile page.

Usage:  python3 scripts/update_people_pubs.py [--all]      (run after update_pubs.py)

Lab papers are refreshed for everyone on every run. Papers from outside the lab
(ORCID and PubMed searches) are refreshed every run for current members, but for
alumni only in the first week of the month (or with --all); otherwise their last
list is kept.

Each page lists:
  - MAIR Lab papers: entries in assets/js/pubs.js (CV-gated) with the person among
    the authors. A name match ("Sharma A") only counts if PubMed gives the same first
    name ("Arpit"), so a different A. Sharma on a collaborative paper is never picked up.
    New lab papers appear automatically.
  - CV_EXTRA: CV items that are not on PubMed (some preprints, a book chapter).
  - Other papers from the person's ORCID record (ORCID below), which they curate
    themselves, so no name-matching risk. Refreshed every run.
  - Current members also: papers from before or outside the lab, found by a
    PubMed name search. Name searches pick up other people with the same name, so a
    paper is only shown once its PMID is in that person's CONFIRMED set. New hits go
    to scripts/pending_people_pubs.json for review in the weekly briefing: add the
    PMID to CONFIRMED if it is theirs, or to EXCLUDE if it is someone else's.
    Alumni without an ORCID list MAIR Lab papers only.

A person with a page needs an entry in PEOPLE (slug = pages/people/<slug>.html).
"""
import json, pathlib, re, sys, time, unicodedata, urllib.parse, urllib.request
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
    "robin-yeo": ("Robin", ["Yeo R"]),
    "emina-tabakovic": ("Emina", ["Tabakovic E"]),
    "nicole-clark": ("Nicole", ["Clark NM", "Clark N"]),
    "lourdes-pajuelo": ("Lourdes", ["Pajuelo Torres L", "Pajuelo L"]),
    "raymond-laboy-morales": ("Raymond", ["Laboy R"]),
    "iris-lee": ("Chia-Lin", ["Lee CL"]),
    "malini-bhadra": ("Malini", ["Bhadra M"]),
    "porsha-howell": ("Porsha", ["Howell P"]),
    "ryann-guayasamin": ("Ryann", ["Guayasamin R"]),
    "noel-jackson": ("Noel", ["Jackson N", "Jackson NA"]),
    "kaitlyn-izzo": ("Kaitlyn", ["Izzo K"]),
    "juan-ramirez": ("Juan", ["Ramirez JC", "Ramirez J"]),
    "sydney-brumfield": ("Sydney", ["Brumfield S"]),
    "jeeyun-kim": ("Jeeyun", ["Kim JA", "Kim J"]),
    "ana-paula-morales-allende": ("Ana Paula", ["Morales Allende AP", "Morales-Allende AP"]),
    "dana-fleischhauer": ("Dana", ["Fleischhauer D", "Pfeifer D"]),
    "catherin-desousa": ("Catherin", ["DeSousa C"]),
    "cailin-cronin": ("Cailin", ["Cronin C"]),
    "andrew-larocque": ("Andrew", ["Larocque A"]),
    "samuel-lapp": ("Samuel", ["Lapp S", "Lapp SA"]),
    "victoria-cottrell": ("Victoria", ["Cottrell V"]),
    "staci-thornton": ("Staci", ["Thornton S", "Thornton SM"]),
    "peter-stine": ("Peter", ["Stine PG", "Stine P"]),
    "ana-gallegos-cruz": ("Ana", ["Gallegos Cruz A", "Cruz AG"]),
    "elissa-lin": ("Elissa", ["Lin E"]),
    "tinatini-tavhelidse": ("Tinatini", ["Tavhelidse T", "Tavhelidse-Suck T"]),
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

# ORCID iDs, checked against the lab papers or employment history on each record (26 Oct 2026).
# Not matches: "Noel Jackson" 0000-0002-9961-5608, "Rohan Sehgal" 0000-0001-5495-2961,
# "Chia-Lin Lee" 0000-0003-2679-9001 (different people).
ORCID = {
    "anne-lanjuin": "0000-0003-2532-0863", "aditi-prabhakar": "0000-0002-6024-4600",
    "christopher-morrow": "0000-0002-9208-2511", "jamie-kraft": "0000-0001-6336-9997",
    "miriam-valera-alberni": "0000-0002-1144-573X", "laura-wester": "0000-0003-2668-8141",
    "vanessa-laversenne": "0000-0002-1929-477X", "carlos-silva-garcia": "0000-0002-0434-7787",
    "suvagata-roy-chowdhury": "0000-0001-6127-5276", "maria-perez-matos": "0000-0002-2841-9810",
    "hannah-smith": "0000-0003-2524-8929", "ewelina-nowak": "0009-0001-2521-4908",
    "samuel-lapp": "0000-0003-2645-170X", "sneha-dutta": "0000-0002-9745-9250",
    "peter-stine": "0009-0009-6723-8316", "lourdes-pajuelo": "0000-0002-6578-6687",
    "raymond-laboy-morales": "0000-0002-0375-1550", "victoria-cottrell": "0009-0001-4311-7036",
    "staci-thornton": "0000-0002-1449-4860", "ana-gallegos-cruz": "0000-0002-6840-922X",
    "elissa-lin": "0000-0002-7017-3869", "tinatini-tavhelidse": "0000-0002-6103-9019",
}

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
        "confirmed": {"26182205", "30849364", "32109376", "33190414", "34430917", "34714522", "36056070",
                      "37292613", "38521057", "38682901", "40684436"},  # 26182205: Dayton, on his ORCID
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
        "exclude": {"27916805"},  # Ottawa 2016 review: Will said ignore for now (26 Oct 2026)
    },
    "emily-levesque": {"query": '"Levesque, Emily"[FAU]', "confirmed": set(),
                       "exclude": {"29434254"}},  # BMC 2018: Will said ignore for now (26 Oct 2026)
    "kate-roh": {"query": '"Roh, Younjoo"[FAU] OR "Roh, Kate"[FAU]', "confirmed": set(), "exclude": set()},
}


# Alumni without an ORCID: PubMed name search, vetted 26 Oct 2026 (affiliation matched to their known
# positions). Only CONFIRMED PMIDs are shown; new hits go to pending_people_pubs.json for review.
ALUMNI_PUBMED = {
    "arpit-sharma": {"query": "\"Sharma, Arpit\"[FAU] AND (Harvard[ad] OR Tufts[ad] OR elegans OR aging OR longevity OR mitochondria OR peroxisome*)",
        "confirmed": {'41242931', '32273472'},
        "exclude": {'26628760', '22754862', '20401857', '36299295', '37602153', '38505998', '41660611', '40257544', '22381019', '38470345', '38678502', '37500959', '39980204', '41298968', '41360239', '39368002', '40014234', '32587220', '37686109', '40522073', '21739020', '36271718', '36387457', '40886252', '40664120', '42243420', '40721402', '34086608', '42594262', '23120561', '40284435', '26224228', '42703705', '30777961', '41839231', '41657590', '42320775', '23120473', '42247589', '21739018', '42910368', '38647206', '37378153', '35377608', '42505571', '24021829', '39274943', '40461274', '26344103', '30957513', '30689605', '40958459', '38739090', '27486743', '36960257', '42658028', '42696892', '31484072', '23120644', '30385511', '39641841', '31305240', '33288450', '33880661', '24294590', '39189316', '42756231', '31070683', '25753164', '31869286', '41346041', '24068067', '23200556', '31789924', '42738889'}},
    "malini-bhadra": {"query": "\"Bhadra, Malini\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "heather-weir": {"query": "\"Weir, Heather J\"[FAU] OR \"Weir, Heather\"[FAU] AND (Astex[ad] OR Harvard[ad] OR elegans)",
        "confirmed": {'38932616'},
        "exclude": {'26648935', '28621591', '37046406', '22487531', '27779917', '26513745', '16845815', '18030966'}},
    "caroline-heintz": {"query": "\"Heintz, Caroline\"[FAU]",
        "confirmed": {'19394257', '42744283', '21147011', '23559577', '22698810', '26803807', '22300847'},
        "exclude": set()},
    "kristopher-burkewitz": {"query": "\"Burkewitz, Kristopher\"[FAU]",
        "confirmed": {'39932386', '36968071', '35451962', '41959216', '40593680', '42046291', '41629400', '38895376', '42722646', '37574379', '41387410', '40950144', '36305642'},
        "exclude": set()},
    "pallas-yao": {"query": "\"Yao, Pallas\"[FAU]",
        "confirmed": set(),
        "exclude": {'39071403'}},
    "caroline-escoubas": {"query": "\"Escoubas, Caroline\"[FAU] OR \"Escoubas, Caroline C\"[FAU]",
        "confirmed": {'41826292', '42664052', '38658221', '35233577', '39480923', '38490196'},
        "exclude": {'39677624', '36993292'}},
    "yue-zhang": {"query": "\"Zhang, Yue\"[FAU] AND \"Mair WB\"[au]",
        "confirmed": set(),
        "exclude": {'31752923', '37461570', '38306481', '24191734', '29075327', '37333617', '36607839', '42665934', '39825823', '33159371', '35011057', '42537681', '36276651', '27209349', '28681074', '39799120', '34404427', '33262253', '35504075', '33152509', '31727677', '39425164', '36669290', '40067297', '33978323', '35088753', '39151443', '29532020', '19003489', '29056576', '32393339', '35858757', '27637299', '34561347', '42521824', '37178182', '31803417', '42490418', '24651621', '27007212', '31341179', '33640473', '36184228', '32704510', '42647764', '35905772', '33004794', '38033986', '29405123', '34613627', '38956063', '30507908', '28768909', '33929613', '27824883', '25877509', '30700398', '31335134', '32550934', '30312845', '28717493', '36588101', '37475459', '37480375', '35081860', '41751369', '26422014', '31648171', '32949998', '30596386', '30508507', '36307355', '39362096', '38172637', '32605560', '25573665', '40148321', '41273919'}},
    "ianessa-morantte": {"query": "\"Morantte, Ianessa\"[FAU]",
        "confirmed": {'22922647', '26687359', '17991726', '22972301', '23551888', '12567184', '14614508', '39385031', '17964260', '31230716', '12667668', '37745588'},
        "exclude": set()},
    "noel-jackson": {"query": "\"Jackson, Noel\"[FAU] OR \"Jackson, Noel A\"[FAU]",
        "confirmed": {'36062141'},
        "exclude": {'19891042', '30845509'}},
    "rohan-sehgal": {"query": "\"Sehgal, Rohan\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "robin-yeo": {"query": "\"Yeo, Robin\"[FAU] OR \"Yeo, Robin W\"[FAU]",
        "confirmed": {'29590078', '37118502', '31282863', '37443352', '26959179', '32726579', '29141961', '39358505'},
        "exclude": {'25648963'}},
    "nicole-clark": {"query": "\"Clark, Nicole M\"[FAU] OR (\"Clark, Nicole\"[FAU] AND (Harvard[ad] OR Ohio[ad]))",
        "confirmed": {'39305068'},
        "exclude": {'17897767', '18098037', '33118445', '25447994', '17455081'}},
    "emina-tabakovic": {"query": "\"Tabakovic, Emina\"[FAU] OR \"Gulbis, Emina\"[FAU]",
        "confirmed": {'41831714'},
        "exclude": set()},
    "kaitlyn-izzo": {"query": "\"Izzo, Kaitlyn\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "juan-ramirez": {"query": "\"Ramirez, Juan C\"[FAU] AND (Harvard[ad] OR Brandeis[ad])",
        "confirmed": {'38959314'},
        "exclude": set()},
    "sydney-brumfield": {"query": "\"Brumfield, Sydney\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "jeeyun-kim": {"query": "\"Kim, Jeeyun A\"[FAU] OR (\"Kim, Jeeyun\"[FAU] AND (Harvard[ad] OR Abbott[ad] OR Berkeley[ad]))",
        "confirmed": {'33806453', '38936445', '40584822', '42863594', '39344010', '40645431'},
        "exclude": set()},
    "ana-paula-morales-allende": {"query": "\"Morales Allende, Ana Paula\"[FAU] OR \"Morales-Allende, Ana Paula\"[FAU]",
        "confirmed": {'28490641'},
        "exclude": set()},
    "iris-lee": {"query": "\"Lee, Chia-Lin\"[FAU] AND (\"Cheng Kung\"[ad] OR Harvard[ad] OR elegans)",
        "confirmed": {'27305857'},
        "exclude": {'35459072', '31504897', '33929497', '18758357'}},
    "dana-fleischhauer": {"query": "\"Fleischhauer, Dana\"[FAU] OR \"Pfeifer, Dana\"[FAU]",
        "confirmed": {'33651839'},
        "exclude": set()},
    "catherin-desousa": {"query": "\"DeSousa, Catherin\"[FAU] OR \"DeSousa, Catherine\"[FAU]",
        "confirmed": {'40034647', '37646003', '40230520'},
        "exclude": set()},
    "cailin-cronin": {"query": "\"Cronin, Cailin\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "andrew-larocque": {"query": "\"Larocque, Andrew\"[FAU]",
        "confirmed": set(),
        "exclude": {'29309437', '32759291'}},
    "porsha-howell": {"query": "\"Howell, Porsha\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
    "ryann-guayasamin": {"query": "\"Guayasamin, Ryann\"[FAU]",
        "confirmed": set(),
        "exclude": set()},
}
OUTSIDE.update(ALUMNI_PUBMED)

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


def orcid_works(oid):
    """(pmids, other entries without a PMID) from a public ORCID record."""
    req = urllib.request.Request(f"https://pub.orcid.org/v3.0/{oid}/works", headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        groups = json.load(r)["group"]
    time.sleep(0.3)
    pmids, rest = [], []
    for g in groups:
        ids = {e["external-id-type"]: (e.get("external-id-value") or "") for e in (g.get("external-ids") or {}).get("external-id", [])}
        w = g["work-summary"][0]
        title = re.sub(r"<[^>]+>", "", w["title"]["title"]["value"]).rstrip(".")
        if JUNK.match(title):
            continue
        if ids.get("pmid"):
            pmids.append(ids["pmid"].strip())
            continue
        year = ((w.get("publication-date") or {}).get("year") or {}).get("value")
        if not year:
            continue
        journal = (w.get("journal-title") or {}).get("value") or ""
        rest.append({"pmid": "", "year": int(year), "title": title,
                     "authors": [], "journal": journal, "doi": ids.get("doi", "").lower(),
                     "kind": "preprint" if w.get("type") == "preprint" or "rxiv" in journal.lower() else "article"})
    # most ORCID works carry only a DOI: find their PubMed records so author lists show
    dois = [e["doi"] for e in rest if e["doi"]]
    for i in range(0, len(dois), 40):
        found = get("esearch.fcgi", term=" OR ".join(f'"{d}"[doi]' for d in dois[i:i + 40]), retmax=100)["esearchresult"]["idlist"]
        if found:
            summ = get("esummary.fcgi", id=",".join(found))["result"]
            for pmid in summ["uids"]:
                doi = next((a["value"].lower() for a in summ[pmid].get("articleids", []) if a["idtype"] == "doi"), "")
                if doi in dois:
                    pmids.append(pmid)
                    rest = [e for e in rest if e["doi"] != doi]
    return pmids, rest


JUNK = re.compile(r"(erratum|corrigendum|correction|supplementary|data from)\b", re.I)


def words(title):
    t = fold(title).replace("caenorhabditis", "").replace("knockin", "knock in").replace("toolkit", "tool kit")
    return {w for w in re.findall(r"[a-z0-9]+", t) if len(w) > 3}


def same_paper(title, others):
    """True if a title is a preprint or reworded copy of one already listed."""
    w = words(title)
    return any(len(w & o) / max(1, len(w | o)) >= 0.5 for o in others)


def key(p):
    return p.get("pmid") or p.get("doi", "").lower() or fold(p["title"])[:45]


CURRENT = {"anne-lanjuin", "aditi-prabhakar", "christopher-morrow", "jamie-kraft", "emily-levesque", "kate-roh"}
REFRESH_ALUMNI = "--all" in sys.argv or __import__("datetime").date.today().day <= 7
try:
    _old = OUT.read_text()
    PREVIOUS = json.loads(_old[_old.index("{"):_old.rindex("}") + 1])
except (FileNotFoundError, ValueError):
    PREVIOUS, REFRESH_ALUMNI = {}, True

LAB_TITLES = {fold(p["title"])[:45] for p in lab + CV_EXTRA}
LAB_WORDS = [words(p["title"]) for p in lab + CV_EXTRA]
shown, pending = {}, []
for slug, (first, names) in PEOPLE.items():
    papers = [dict(p, lab=True) for p in lab + CV_EXTRA if is_them(p, slug)]
    if slug not in CURRENT and not REFRESH_ALUMNI and slug in PREVIOUS:
        kept = [p for p in PREVIOUS[slug]["papers"] if not p.get("lab")]
        papers.sort(key=lambda p: (-p["year"], p["title"]))
        shown[slug] = {"names": names, "orcid": ORCID.get(slug, ""), "papers": papers + sorted(kept, key=lambda p: (-p["year"], p["title"]))}
        continue
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
    if slug in ORCID:
        pmids, rest = orcid_works(ORCID[slug])
        have = LAB_TITLES | {key(p) for p in papers} | {p.get("doi", "").lower() for p in papers if p.get("doi")} | {fold(p["title"])[:45] for p in papers}
        pmids = [i for i in dict.fromkeys(pmids) if i not in have and i not in (m or {}).get("exclude", set())]
        seen = LAB_WORDS + [words(p["title"]) for p in papers]
        if pmids:
            summary = get("esummary.fcgi", id=",".join(pmids))["result"]
            for pmid in summary["uids"]:
                r = summary[pmid]
                if {"Erratum", "Published Erratum"} & set(r.get("pubtype", [])):
                    continue
                e = entry(pmid, r)
                if fold(e["title"])[:45] not in have and e["doi"].lower() not in have and not same_paper(e["title"], seen):
                    papers.append(e); have |= {pmid, e["doi"].lower(), fold(e["title"])[:45]}; seen.append(words(e["title"]))
        for e in rest:
            if e["doi"] not in have and fold(e["title"])[:45] not in have and not same_paper(e["title"], seen):
                papers.append(e); have |= {e["doi"], fold(e["title"])[:45]}; seen.append(words(e["title"]))
        papers = [p for p in papers if p.get("lab") or not any(a.startswith("Mair W") for a in p["authors"]) or p["pmid"] in (m or {}).get("confirmed", set())]
    papers.sort(key=lambda p: (-p["year"], p["title"]))
    shown[slug] = {"names": names, "orcid": ORCID.get(slug, ""), "papers": papers}

OUT.write_text("// Generated by scripts/update_people_pubs.py — do not edit by hand.\n"
               "window.PEOPLE_PUBS = " + json.dumps(shown, ensure_ascii=False, indent=1) + ";\n")
PENDING.write_text(json.dumps(pending, ensure_ascii=False, indent=1) + "\n")
for slug, s in shown.items():
    n_lab = sum(1 for p in s["papers"] if p.get("lab"))
    print(f"{slug}: {n_lab} MAIR Lab, {len(s['papers']) - n_lab} other")
print(f"{len(pending)} unconfirmed PubMed record(s) -> {PENDING.name} for review")
for p in pending:
    print(f"  PENDING {p['member']} {p['pmid']} {p['year']} {p['journal']}: {p['title'][:80]} ({', '.join(p['authors'][:4])} ...)")
