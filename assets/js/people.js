/* ==========================================================================
   LAB PEOPLE — edit this file to update the People page.
   Source of truth: Mair_CV_2026 (Mentoring and Training section).

   current: people in the lab now (shown in this order).
     name   — full name
     role   — e.g. "Postdoctoral Fellow", "Graduate Student"
     since  — year joined
     focus  — optional one-line research focus or fellowship
     photo  — optional, e.g. "assets/img/people/jane-doe.jpg" (4:5 portrait on the
              shared background: see scripts/portraits/README.md)
     slug   — optional; links the card to people/<slug>.html (page source in
              pages/people/<slug>.html; add them to PEOPLE in
              scripts/update_people_pubs.py so their papers list there)
     links  — optional { orcid, scholar, x, bluesky, linkedin, web }
   alumni: former members. Move someone here when they leave, and add
     group  — "postdoc" | "phd" | "staff" | "student" (visiting, post-bac, undergraduate)
     years  — e.g. "2019–2025" (each group is sorted newest first by end year)
     now    — optional, where they went next
     slug   — optional; alumni who published with the lab have a page too
   ========================================================================== */

window.PEOPLE = {
  current: [
    { name: "Anne Lanjuin", role: "Senior Research Scientist", since: "2015",
      slug: "anne-lanjuin", photo: "assets/img/people/anne-lanjuin.jpg", links: { orcid: "https://orcid.org/0000-0003-2532-0863", linkedin: "https://www.linkedin.com/in/anne-lanjuin-6903a393/" } },
    { name: "Aditi Prabhakar", role: "Postdoctoral Fellow", since: "2021",
      focus: "Moore Foundation Fellow",
      slug: "aditi-prabhakar", photo: "assets/img/people/aditi-prabhakar.jpg", links: { scholar: "https://scholar.google.com/citations?user=Xo3Tk60AAAAJ", orcid: "https://orcid.org/0000-0002-6024-4600", linkedin: "https://www.linkedin.com/in/aditiprabhakar/" } },
    { name: "Christopher Morrow", role: "Postdoctoral Fellow", since: "2021",
      focus: "NIA F32 and K99/R00 awardee",
      slug: "christopher-morrow", photo: "assets/img/people/christopher-morrow.jpg", links: { orcid: "https://orcid.org/0000-0002-9208-2511", linkedin: "https://www.linkedin.com/in/morrowc1/", scholar: "https://scholar.google.com/citations?user=lIDGXWEAAAAJ" } },
    { name: "Jamie Kraft", role: "Postdoctoral Fellow", since: "2025",
      focus: "Swedish Research Council Fellow",
      slug: "jamie-kraft", photo: "assets/img/people/jamie-kraft.jpg", links: { scholar: "https://scholar.google.com/citations?user=e5BvsF0AAAAJ", orcid: "https://orcid.org/0000-0001-6336-9997", linkedin: "https://www.linkedin.com/in/jamie-kraft/" } },
    { name: "Emily Levesque", role: "Research Assistant", since: "2026",
      slug: "emily-levesque", photo: "assets/img/people/emily-levesque.jpg", links: { linkedin: "https://www.linkedin.com/in/emilylevesque/" } },
    { name: "Kate Roh", role: "Research Assistant", since: "2026",
      slug: "kate-roh", photo: "assets/img/people/kate-roh.jpg", links: { linkedin: "https://www.linkedin.com/in/kate-roh-598268294/" } }
  ],

  alumni: [
    // Postdoctoral fellows
    { group: "postdoc", name: "Miriam Valera-Alberni", role: "Postdoctoral Fellow", years: "2021–2025", now: "Junior Lecturer, University of Lausanne (UNIL)", slug: "miriam-valera-alberni", links: { scholar: "https://scholar.google.com/citations?user=vxZXJpcAAAAJ", orcid: "https://orcid.org/0000-0002-1144-573X", linkedin: "https://www.linkedin.com/in/miriam-valera-alberni/" } },
    { group: "postdoc", name: "Laura Wester", role: "Postdoctoral Fellow", years: "2021–2025", now: "Postdoctoral Scientist, Max Planck Institute for Biology of Ageing", slug: "laura-wester", links: { orcid: "https://orcid.org/0000-0003-2668-8141", linkedin: "https://www.linkedin.com/in/laura-wester/" } },
    { group: "postdoc", name: "Arpit Sharma", role: "Postdoctoral Fellow", years: "2018–2025", now: "Principal Investigator, Jean Mayer USDA Human Nutrition Research Center on Aging, Tufts University", slug: "arpit-sharma", links: { scholar: "https://scholar.google.com/citations?user=0BAJOAwAAAAJ", linkedin: "https://www.linkedin.com/in/arpit-sharma-phd-13529333/" } },
    { group: "postdoc", name: "Vanessa Laversenne", role: "Postdoctoral Fellow", years: "2019–2023", now: "Senior Research Scientist, Broad Institute", slug: "vanessa-laversenne", links: { scholar: "https://scholar.google.com/citations?user=4f_WBG0AAAAJ", orcid: "https://orcid.org/0000-0002-1929-477X", linkedin: "https://www.linkedin.com/in/vanessa-laversenne-61351a64/" } },
    { group: "postdoc", name: "Carlos Silva-García", role: "Postdoctoral Fellow", years: "2015–2023", now: "Assistant Professor, Brown University", slug: "carlos-silva-garcia", photo: "assets/img/people/carlos-silva-garcia.jpg", links: { scholar: "https://scholar.google.com/citations?user=z9Tj5ecAAAAJ", orcid: "https://orcid.org/0000-0002-0434-7787", linkedin: "https://www.linkedin.com/in/cgsilvagarcia/" } },
    { group: "postdoc", name: "Malini Bhadra", role: "Postdoctoral Fellow", years: "2019–2020", now: "Global Support and Service Trainer, Thermo Fisher Scientific", slug: "malini-bhadra", links: { linkedin: "https://www.linkedin.com/in/malinibhadra/" } },
    { group: "postdoc", name: "Porsha Howell", role: "Postdoctoral Fellow", years: "2018–2020", now: "Senior Scientist, MBX Biosciences", slug: "porsha-howell", links: { linkedin: "https://www.linkedin.com/in/howell-porsha/" } },
    { group: "postdoc", name: "Suvagata Roy Chowdhury", role: "Postdoctoral Fellow", years: "2017–2018", now: "MRC Mitochondrial Biology Unit, University of Cambridge", slug: "suvagata-roy-chowdhury", links: { orcid: "https://orcid.org/0000-0001-6127-5276" } },
    { group: "postdoc", name: "Ryann Guayasamin", role: "Postdoctoral Fellow", years: "2016–2017", now: "Lecturer, University of Vermont", slug: "ryann-guayasamin", links: { web: "https://www.uvm.edu/cas/biology/profile/ryann-guayasamin" } },
    { group: "postdoc", name: "Heather Weir", role: "Postdoctoral Fellow", years: "2014–2017", now: "Associate Director, Astex Pharmaceuticals", slug: "heather-weir", photo: "assets/img/people/heather-weir.jpg", links: { scholar: "https://scholar.google.com/citations?user=XoRs3U4AAAAJ", linkedin: "https://www.linkedin.com/in/heather-weir-536473b0/" } },
    { group: "postdoc", name: "Caroline Heintz", role: "Postdoctoral Fellow & Lab Manager", years: "2013–2022", now: "Head of Laboratory, MGZ Medical Genetics Center, Munich", slug: "caroline-heintz", photo: "assets/img/people/caroline-heintz.jpg", links: { scholar: "https://scholar.google.com/citations?user=sOxtUd8AAAAJ", linkedin: "https://www.linkedin.com/in/caroline-heintz-34080a1b/" } },
    { group: "postdoc", name: "Kristopher Burkewitz", role: "Postdoctoral Fellow", years: "2012–2018", now: "Assistant Professor of Cell and Developmental Biology, Vanderbilt University", slug: "kristopher-burkewitz", photo: "assets/img/people/kristopher-burkewitz.jpg", links: { scholar: "https://scholar.google.com/citations?user=W4GX5g4AAAAJ", linkedin: "https://www.linkedin.com/in/kristopher-burkewitz-a17b57152/" } },

    // Doctoral students
    { group: "phd", name: "Maria Perez Matos", role: "Ph.D. student (BPH)", years: "2019–2025", slug: "maria-perez-matos", links: { scholar: "https://scholar.google.com/citations?user=DlZVZZMAAAAJ", orcid: "https://orcid.org/0000-0002-2841-9810", linkedin: "https://www.linkedin.com/in/maria-22-perezmatos/" } },
    { group: "phd", name: "Hannah Smith", role: "Ph.D. student (BPH)", years: "2018–2024", slug: "hannah-smith", links: { orcid: "https://orcid.org/0000-0003-2524-8929", linkedin: "https://www.linkedin.com/in/hjsmithphd/" } },
    { group: "phd", name: "Ewelina Nowak", role: "Ph.D. student (MCO)", years: "2022–2023", now: "Ph.D. student, Lee Lab, Harvard University", slug: "ewelina-nowak", links: { scholar: "https://scholar.google.com/citations?user=VAgHfl0AAAAJ", orcid: "https://orcid.org/0009-0001-2521-4908", web: "https://www.mcb.harvard.edu/directory/ewelina-nowak/" } },
    { group: "phd", name: "Samuel Lapp", role: "Ph.D. student (BPH)", years: "2021–2023", now: "Postdoctoral Fellow, Salk Institute for Biological Studies", slug: "samuel-lapp", links: { orcid: "https://orcid.org/0000-0003-2645-170X", linkedin: "https://www.linkedin.com/in/samuel-lapp-b5a100189/" } },
    { group: "phd", name: "Noel Jackson", role: "Ph.D. student (BBS)", years: "2020–2023", now: "Ph.D. candidate, Miller Lab, Brigham and Women's Hospital and Harvard Medical School", slug: "noel-jackson", links: { linkedin: "https://www.linkedin.com/in/noelajackson/", web: "https://www.mbmillerlab.org/people" } },
    { group: "phd", name: "Pallas Yao", role: "Ph.D. student (BPH), then postdoc", years: "2017–2022", now: "Domain Researcher and Scientific Writer, Avandar Labs", slug: "pallas-yao", photo: "assets/img/people/pallas-yao.jpg", links: { linkedin: "https://www.linkedin.com/in/pallas-yao/" } },
    { group: "phd", name: "Sneha Dutta", role: "Ph.D. student (BPH)", years: "2016–2021", now: "Manager, Putnam", slug: "sneha-dutta", photo: "assets/img/people/sneha-dutta.jpg", links: { orcid: "https://orcid.org/0000-0002-9745-9250", linkedin: "https://www.linkedin.com/in/snehadtt/" } },
    { group: "phd", name: "Caroline Escoubas", role: "Ph.D. student (University of Nice)", years: "2014–2018", now: "Assistant Member, Center of Excellence in Neuro-Oncology Sciences, St. Jude Children's Research Hospital", slug: "caroline-escoubas", photo: "assets/img/people/caroline-escoubas.jpg", links: { linkedin: "https://www.linkedin.com/in/caroline-escoubas-g/" } },
    { group: "phd", name: "Yue Zhang", role: "Ph.D. student (BPH)", years: "2012–2018", now: "Senior Director, Competitive Intelligence (Oncology R&D), AstraZeneca", slug: "yue-zhang", photo: "assets/img/people/yue-zhang.jpg", links: { linkedin: "https://www.linkedin.com/in/yue-zhang-bcg/" } },

    // Research staff
    { group: "staff", name: "Cailin Cronin", role: "Research Assistant (undergraduate researcher, 2024)", years: "2026", now: "M.S. student in Pharmaceutical Engineering", slug: "cailin-cronin", links: { linkedin: "https://www.linkedin.com/in/cailin-cronin/" } },
    { group: "staff", name: "Peter Stine", role: "Research Assistant", years: "2019–2025", now: "Ph.D. student, New York University", slug: "peter-stine", links: { orcid: "https://orcid.org/0009-0009-6723-8316", linkedin: "https://www.linkedin.com/in/peter-stine-579907174/" } },
    { group: "staff", name: "Ianessa Morantte", role: "Senior Scientist", years: "2011–2015", now: "Head of Therapeutics R&D, Prolific Machines", slug: "ianessa-morantte", photo: "assets/img/people/ianessa-morantte.jpg", links: { scholar: "https://scholar.google.com/citations?user=N0_yzrEAAAAJ", linkedin: "https://www.linkedin.com/in/imorantte/" } },
    { group: "staff", name: "Andrew Larocque", role: "Research Assistant", years: "2020", now: "Engineer, Portal Biotechnologies", slug: "andrew-larocque", links: { linkedin: "https://www.linkedin.com/in/andrew-larocque-607489207/" } },
    { group: "staff", name: "Rohan Sehgal", role: "Research Assistant", years: "2018–2019", now: "Neurology Resident Physician, UF College of Medicine, Jacksonville", slug: "rohan-sehgal", links: { web: "https://neurology.med.jax.ufl.edu/education/neurology-residency/residents/" } },
    { group: "staff", name: "Emina Tabakovic", role: "Research Assistant", years: "2017–2018", now: "OB/GYN Resident Physician, Banner University Medical Center Phoenix", slug: "emina-tabakovic", photo: "assets/img/people/emina-tabakovic.jpg", links: { linkedin: "https://www.linkedin.com/in/emina-gulbis-md-ms-3899a2ba/" } },
    { group: "staff", name: "Nicole Clark", role: "Research Assistant", years: "2016–2018", now: "Family Medicine resident, The Ohio State University", slug: "nicole-clark", photo: "assets/img/people/nicole-clark.jpg", links: { linkedin: "https://www.linkedin.com/in/nicole-m-clark-md-ms-mph-398a59a9/" } },
    { group: "staff", name: "Robin Yeo", role: "Research Assistant", years: "2013", now: "Founder, Koerner-Yeo Biological Data Consulting", slug: "robin-yeo", photo: "assets/img/people/robin-yeo.jpg", links: { scholar: "https://scholar.google.com/citations?user=4Fp_IowAAAAJ", linkedin: "https://www.linkedin.com/in/robinwyeo/" } },

    // Post-bacs, visiting and undergraduate researchers
    { group: "student", name: "Ana Gallegos Cruz", role: "Postbaccalaureate Researcher", years: "2024", now: "Master's student, École Normale Supérieure, Paris", slug: "ana-gallegos-cruz", links: { orcid: "https://orcid.org/0000-0002-6840-922X", linkedin: "https://www.linkedin.com/in/anagallegoscruz/" } },
    { group: "student", name: "Lourdes Pajuelo", role: "Postbaccalaureate Researcher", years: "2022", now: "Ph.D. student, Weill Cornell Graduate School of Medical Sciences", slug: "lourdes-pajuelo", links: { scholar: "https://scholar.google.com/citations?user=mNd0MTMAAAAJ", orcid: "https://orcid.org/0000-0002-6578-6687", linkedin: "https://www.linkedin.com/in/lourdes-pajuelo-31395514b/" } },
    { group: "student", name: "Dana Fleischhauer", role: "Visiting Student (Heidelberg)", years: "2019", now: "Senior Consultant, Temedica", slug: "dana-fleischhauer", links: { linkedin: "https://www.linkedin.com/in/dana-pfeifer/" } },
    { group: "student", name: "Iris Lee", role: "Visiting M.S. Student (NCKU, Taiwan)", years: "2016", slug: "iris-lee" },
    { group: "student", name: "Tinatini Tavhelidse", role: "Visiting Student (Heidelberg)", years: "2012", now: "Postdoctoral Researcher, Heidelberg University", slug: "tinatini-tavhelidse", links: { scholar: "https://scholar.google.com/citations?user=MOVib6AAAAAJ", orcid: "https://orcid.org/0000-0002-6103-9019" } },
    { group: "student", name: "Catherin DeSousa", role: "Undergraduate Researcher", years: "2022", now: "Ph.D. student, Metabolic Biology, UC Berkeley", slug: "catherin-desousa", links: { linkedin: "https://www.linkedin.com/in/catherin-desousa-77392a241/" } },
    { group: "student", name: "Victoria Cottrell", role: "Undergraduate Researcher (Wellesley)", years: "2021", now: "Ph.D. student, Harvard Medical School", slug: "victoria-cottrell", links: { scholar: "https://scholar.google.com/citations?user=rRhSbW4AAAAJ", orcid: "https://orcid.org/0009-0001-4311-7036", linkedin: "https://www.linkedin.com/in/vicottrell/" } },
    { group: "student", name: "Kaitlyn Izzo", role: "Undergraduate Researcher (Northeastern)", years: "2016", now: "Principal Scientist, Eli Lilly and Company", slug: "kaitlyn-izzo", photo: "assets/img/people/kaitlyn-izzo.jpg", links: { linkedin: "https://www.linkedin.com/in/kaitlynizzo/" } },
    { group: "student", name: "Juan Ramirez", role: "Undergraduate Researcher (Brandeis)", years: "2016", now: "Senior Data Scientist, Brightside", slug: "juan-ramirez", photo: "assets/img/people/juan-ramirez.jpg", links: { linkedin: "https://www.linkedin.com/in/juancramirez95/" } },
    { group: "student", name: "Sydney Brumfield", role: "Undergraduate Researcher (Wellesley)", years: "2016", now: "Clinical Trial Project Manager, Candel Therapeutics", slug: "sydney-brumfield", photo: "assets/img/people/sydney-brumfield.jpg", links: { linkedin: "https://www.linkedin.com/in/sydney-brumfield/" } },
    { group: "student", name: "Staci Thornton", role: "Undergraduate Researcher (UConn)", years: "2015", now: "Research Specialist, Howard Hughes Medical Institute", slug: "staci-thornton", photo: "assets/img/people/staci-thornton.jpg", links: { orcid: "https://orcid.org/0000-0002-1449-4860", linkedin: "https://www.linkedin.com/in/thorntonstaci/" } },
    { group: "student", name: "Raymond Laboy Morales", role: "Undergraduate Researcher (UNAM)", years: "2015", now: "Research Fellow, Joslin Diabetes Center", slug: "raymond-laboy-morales", photo: "assets/img/people/raymond-laboy-morales.jpg", links: { scholar: "https://scholar.google.com/citations?user=dSeC4UIAAAAJ", orcid: "https://orcid.org/0000-0002-0375-1550", linkedin: "https://www.linkedin.com/in/raylaboy/" } },
    { group: "student", name: "Jeeyun Kim", role: "Undergraduate Researcher (UC Berkeley)", years: "2014", now: "Senior Clinical Scientist, Abbott", slug: "jeeyun-kim", photo: "assets/img/people/jeeyun-kim.jpg", links: { scholar: "https://scholar.google.com/citations?user=lXM2iWwAAAAJ", linkedin: "https://www.linkedin.com/in/jeeyunakim/" } },
    { group: "student", name: "Elissa Lin", role: "Undergraduate Researcher (Harvard)", years: "2013", now: "Clinical Researcher, Brigham and Women's Hospital", slug: "elissa-lin", links: { orcid: "https://orcid.org/0000-0002-7017-3869", linkedin: "https://www.linkedin.com/in/elissa-lin-3a07733a/" } },
    { group: "student", name: "Ana Paula Morales Allende", role: "Undergraduate Researcher (Barnard)", years: "2013", now: "Vascular Surgeon, Conway Medical Center", slug: "ana-paula-morales-allende", photo: "assets/img/people/ana-paula-morales-allende.jpg", links: { linkedin: "https://www.linkedin.com/in/anapaulamoralesallende/" } }
  ]
};
