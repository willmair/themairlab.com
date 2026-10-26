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
              pages/people/<slug>.html, other papers in scripts/update_people_pubs.py)
     pubmed — optional, their author name as in pubs.js (e.g. "Kraft JD"), so
              their lab papers list on their page automatically
     links  — optional { orcid, scholar, x, bluesky, linkedin, web }
   alumni: former members. Move someone here when they leave, and add
     group  — "postdoc" | "phd" | "staff" | "student" (visiting, post-bac, undergraduate)
     years  — e.g. "2019–2025" (each group is sorted newest first by end year)
     now    — optional, where they went next
   ========================================================================== */

window.PEOPLE = {
  current: [
    { name: "Anne Lanjuin", role: "Senior Research Scientist", since: "2015",
      slug: "anne-lanjuin", photo: "assets/img/people/anne-lanjuin.jpg", pubmed: "Lanjuin A" },
    { name: "Aditi Prabhakar", role: "Postdoctoral Fellow", since: "2021",
      focus: "Moore Foundation Fellow",
      slug: "aditi-prabhakar", photo: "assets/img/people/aditi-prabhakar.jpg", pubmed: "Prabhakar A" },
    { name: "Christopher Morrow", role: "Postdoctoral Fellow", since: "2021",
      focus: "NIA F32 and K99/R00 awardee",
      slug: "christopher-morrow", photo: "assets/img/people/christopher-morrow.jpg", pubmed: "Morrow CS" },
    { name: "Jamie Kraft", role: "Postdoctoral Fellow", since: "2025",
      focus: "Swedish Research Council Fellow",
      slug: "jamie-kraft", photo: "assets/img/people/jamie-kraft.jpg", pubmed: "Kraft JD" },
    { name: "Emily Levesque", role: "Research Assistant", since: "2026",
      slug: "emily-levesque", photo: "assets/img/people/emily-levesque.jpg" },
    { name: "Kate Roh", role: "Research Assistant", since: "2026",
      slug: "kate-roh", photo: "assets/img/people/kate-roh.jpg" }
  ],

  alumni: [
    // Postdoctoral fellows
    { group: "postdoc", name: "Miriam Valera-Alberni", role: "Postdoctoral Fellow", years: "2021–2025", now: "University of Lausanne" },
    { group: "postdoc", name: "Laura Wester", role: "Postdoctoral Fellow", years: "2021–2025", now: "Research Scientist, The WNDR Lab" },
    { group: "postdoc", name: "Arpit Sharma", role: "Postdoctoral Fellow", years: "2018–2025", now: "Principal Investigator, USDA HNRCA, Tufts University" },
    { group: "postdoc", name: "Vanessa Laversenne", role: "Postdoctoral Fellow", years: "2019–2023", now: "Research Scientist, Broad Institute" },
    { group: "postdoc", name: "Carlos Silva-García", role: "Postdoctoral Fellow", years: "2015–2023", now: "Assistant Professor, Brown University" },
    { group: "postdoc", name: "Malini Bhadra", role: "Postdoctoral Fellow", years: "2019–2020", now: "Thermo Fisher Scientific" },
    { group: "postdoc", name: "Porsha Howell", role: "Postdoctoral Fellow", years: "2018–2020", now: "Scientist, Bristol Myers Squibb" },
    { group: "postdoc", name: "Suvagata Roy Chowdhury", role: "Postdoctoral Fellow", years: "2017–2018", now: "Oxford Nanoimaging" },
    { group: "postdoc", name: "Ryann Guayasamin", role: "Postdoctoral Fellow", years: "2016–2017", now: "Lecturer, University of Vermont" },
    { group: "postdoc", name: "Heather Weir", role: "Postdoctoral Fellow", years: "2014–2017", now: "Senior Research Associate, Astex Pharmaceuticals" },
    { group: "postdoc", name: "Caroline Heintz", role: "Postdoctoral Fellow & Lab Manager", years: "2013–2022" },
    { group: "postdoc", name: "Kristopher Burkewitz", role: "Postdoctoral Fellow", years: "2012–2018", now: "Principal Investigator, Vanderbilt University" },

    // Doctoral students
    { group: "phd", name: "Maria Perez Matos", role: "Ph.D. student (BPH)", years: "2019–2025" },
    { group: "phd", name: "Hannah Smith", role: "Ph.D. student (BPH)", years: "2018–2024" },
    { group: "phd", name: "Ewelina Nowak", role: "Ph.D. student (MCO)", years: "2022–2023" },
    { group: "phd", name: "Samuel Lapp", role: "Ph.D. student (BPH)", years: "2021–2023" },
    { group: "phd", name: "Noel Jackson", role: "Ph.D. student (BBS)", years: "2020–2023" },
    { group: "phd", name: "Pallas Yao", role: "Ph.D. student (BPH), then postdoc", years: "2017–2022" },
    { group: "phd", name: "Sneha Dutta", role: "Ph.D. student (BPH)", years: "2016–2021", now: "Consultant, Putnam Associates" },
    { group: "phd", name: "Caroline Escoubas", role: "Ph.D. student (University of Nice)", years: "2014–2018", now: "Faculty, St. Jude Children’s Research Hospital" },
    { group: "phd", name: "Yue Zhang", role: "Ph.D. student (BPH)", years: "2012–2018", now: "Postdoctoral Fellow, UT Southwestern" },

    // Research staff
    { group: "staff", name: "Cailin Cronin", role: "Research Assistant (undergraduate researcher, 2024)", years: "2026" },
    { group: "staff", name: "Peter Stine", role: "Research Assistant", years: "2019–2025", now: "Ph.D. student, New York University" },
    { group: "staff", name: "Ianessa Morantte", role: "Senior Scientist", years: "2011–2015" },
    { group: "staff", name: "Andrew Laroque", role: "Research Assistant", years: "2020" },
    { group: "staff", name: "Rohan Sehgal", role: "Research Assistant", years: "2018–2019" },
    { group: "staff", name: "Emina Tabakovic", role: "Research Assistant", years: "2017–2018" },
    { group: "staff", name: "Nicole Clark", role: "Research Assistant", years: "2016–2018" },
    { group: "staff", name: "Robin Yao", role: "Research Assistant", years: "2013" },

    // Post-bacs, visiting and undergraduate researchers
    { group: "student", name: "Ana Gallegos Cruz", role: "Postbaccalaureate Researcher", years: "2024" },
    { group: "student", name: "Lourdes Pajuelo", role: "Postbaccalaureate Researcher", years: "2022" },
    { group: "student", name: "Dana Fleischhauer", role: "Visiting Student (Heidelberg)", years: "2019" },
    { group: "student", name: "Iris Lee", role: "Visiting Student (NCKU, Taiwan)", years: "2016" },
    { group: "student", name: "Tinatini Tavhelidse", role: "Visiting Student (Heidelberg)", years: "2012" },
    { group: "student", name: "Catherine DeSousa", role: "Undergraduate Researcher", years: "2022" },
    { group: "student", name: "Victoria Cottrell", role: "Undergraduate Researcher (Wellesley)", years: "2021" },
    { group: "student", name: "Kaitlyn Izzo", role: "Undergraduate Researcher (Northeastern)", years: "2016" },
    { group: "student", name: "Juan Ramirez", role: "Undergraduate Researcher (Brandeis)", years: "2016" },
    { group: "student", name: "Sydney Brumfield", role: "Undergraduate Researcher (Wellesley)", years: "2016" },
    { group: "student", name: "Staci Thornton", role: "Undergraduate Researcher (UConn)", years: "2015" },
    { group: "student", name: "Raymond Laboy Morales", role: "Undergraduate Researcher (UNAM)", years: "2015" },
    { group: "student", name: "Ashley Kim", role: "Undergraduate Researcher (UC Berkeley)", years: "2014" },
    { group: "student", name: "Elissa Lin", role: "Undergraduate Researcher (Harvard)", years: "2013" },
    { group: "student", name: "Ana Paula Morales Allende", role: "Undergraduate Researcher (Barnard)", years: "2013" }
  ]
};
