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
      slug: "anne-lanjuin", photo: "assets/img/people/anne-lanjuin.jpg" },
    { name: "Aditi Prabhakar", role: "Postdoctoral Fellow", since: "2021",
      focus: "Moore Foundation Fellow",
      slug: "aditi-prabhakar", photo: "assets/img/people/aditi-prabhakar.jpg" },
    { name: "Christopher Morrow", role: "Postdoctoral Fellow", since: "2021",
      focus: "NIA F32 and K99/R00 awardee",
      slug: "christopher-morrow", photo: "assets/img/people/christopher-morrow.jpg" },
    { name: "Jamie Kraft", role: "Postdoctoral Fellow", since: "2025",
      focus: "Swedish Research Council Fellow",
      slug: "jamie-kraft", photo: "assets/img/people/jamie-kraft.jpg" },
    { name: "Emily Levesque", role: "Research Assistant", since: "2026",
      slug: "emily-levesque", photo: "assets/img/people/emily-levesque.jpg" },
    { name: "Kate Roh", role: "Research Assistant", since: "2026",
      slug: "kate-roh", photo: "assets/img/people/kate-roh.jpg" }
  ],

  alumni: [
    // Postdoctoral fellows
    { group: "postdoc", name: "Miriam Valera-Alberni", role: "Postdoctoral Fellow", years: "2021–2025", now: "University of Lausanne", slug: "miriam-valera-alberni" },
    { group: "postdoc", name: "Laura Wester", role: "Postdoctoral Fellow", years: "2021–2025", now: "Research Scientist, The WNDR Lab", slug: "laura-wester" },
    { group: "postdoc", name: "Arpit Sharma", role: "Postdoctoral Fellow", years: "2018–2025", now: "Principal Investigator, USDA HNRCA, Tufts University", slug: "arpit-sharma" },
    { group: "postdoc", name: "Vanessa Laversenne", role: "Postdoctoral Fellow", years: "2019–2023", now: "Research Scientist, Broad Institute", slug: "vanessa-laversenne" },
    { group: "postdoc", name: "Carlos Silva-García", role: "Postdoctoral Fellow", years: "2015–2023", now: "Assistant Professor, Brown University", slug: "carlos-silva-garcia" },
    { group: "postdoc", name: "Malini Bhadra", role: "Postdoctoral Fellow", years: "2019–2020", now: "Thermo Fisher Scientific", slug: "malini-bhadra" },
    { group: "postdoc", name: "Porsha Howell", role: "Postdoctoral Fellow", years: "2018–2020", now: "Scientist, Bristol Myers Squibb", slug: "porsha-howell" },
    { group: "postdoc", name: "Suvagata Roy Chowdhury", role: "Postdoctoral Fellow", years: "2017–2018", now: "Oxford Nanoimaging", slug: "suvagata-roy-chowdhury" },
    { group: "postdoc", name: "Ryann Guayasamin", role: "Postdoctoral Fellow", years: "2016–2017", now: "Lecturer, University of Vermont" },
    { group: "postdoc", name: "Heather Weir", role: "Postdoctoral Fellow", years: "2014–2017", now: "Senior Research Associate, Astex Pharmaceuticals", slug: "heather-weir" },
    { group: "postdoc", name: "Caroline Heintz", role: "Postdoctoral Fellow & Lab Manager", years: "2013–2022", slug: "caroline-heintz" },
    { group: "postdoc", name: "Kristopher Burkewitz", role: "Postdoctoral Fellow", years: "2012–2018", now: "Principal Investigator, Vanderbilt University", slug: "kristopher-burkewitz" },

    // Doctoral students
    { group: "phd", name: "Maria Perez Matos", role: "Ph.D. student (BPH)", years: "2019–2025", slug: "maria-perez-matos" },
    { group: "phd", name: "Hannah Smith", role: "Ph.D. student (BPH)", years: "2018–2024", slug: "hannah-smith" },
    { group: "phd", name: "Ewelina Nowak", role: "Ph.D. student (MCO)", years: "2022–2023", slug: "ewelina-nowak" },
    { group: "phd", name: "Samuel Lapp", role: "Ph.D. student (BPH)", years: "2021–2023" },
    { group: "phd", name: "Noel Jackson", role: "Ph.D. student (BBS)", years: "2020–2023" },
    { group: "phd", name: "Pallas Yao", role: "Ph.D. student (BPH), then postdoc", years: "2017–2022", slug: "pallas-yao" },
    { group: "phd", name: "Sneha Dutta", role: "Ph.D. student (BPH)", years: "2016–2021", now: "Consultant, Putnam Associates", slug: "sneha-dutta" },
    { group: "phd", name: "Caroline Escoubas", role: "Ph.D. student (University of Nice)", years: "2014–2018", now: "Faculty, St. Jude Children’s Research Hospital", slug: "caroline-escoubas" },
    { group: "phd", name: "Yue Zhang", role: "Ph.D. student (BPH)", years: "2012–2018", now: "Postdoctoral Fellow, UT Southwestern", slug: "yue-zhang" },

    // Research staff
    { group: "staff", name: "Cailin Cronin", role: "Research Assistant (undergraduate researcher, 2024)", years: "2026" },
    { group: "staff", name: "Peter Stine", role: "Research Assistant", years: "2019–2025", now: "Ph.D. student, New York University", slug: "peter-stine" },
    { group: "staff", name: "Ianessa Morantte", role: "Senior Scientist", years: "2011–2015", slug: "ianessa-morantte" },
    { group: "staff", name: "Andrew Laroque", role: "Research Assistant", years: "2020" },
    { group: "staff", name: "Rohan Sehgal", role: "Research Assistant", years: "2018–2019", slug: "rohan-sehgal" },
    { group: "staff", name: "Emina Tabakovic", role: "Research Assistant", years: "2017–2018", slug: "emina-tabakovic" },
    { group: "staff", name: "Nicole Clark", role: "Research Assistant", years: "2016–2018", slug: "nicole-clark" },
    { group: "staff", name: "Robin Yeo", role: "Research Assistant", years: "2013", slug: "robin-yeo" },

    // Post-bacs, visiting and undergraduate researchers
    { group: "student", name: "Ana Gallegos Cruz", role: "Postbaccalaureate Researcher", years: "2024" },
    { group: "student", name: "Lourdes Pajuelo", role: "Postbaccalaureate Researcher", years: "2022", slug: "lourdes-pajuelo" },
    { group: "student", name: "Dana Fleischhauer", role: "Visiting Student (Heidelberg)", years: "2019" },
    { group: "student", name: "Iris Lee", role: "Visiting Student (NCKU, Taiwan)", years: "2016" },
    { group: "student", name: "Tinatini Tavhelidse", role: "Visiting Student (Heidelberg)", years: "2012" },
    { group: "student", name: "Catherine DeSousa", role: "Undergraduate Researcher", years: "2022" },
    { group: "student", name: "Victoria Cottrell", role: "Undergraduate Researcher (Wellesley)", years: "2021" },
    { group: "student", name: "Kaitlyn Izzo", role: "Undergraduate Researcher (Northeastern)", years: "2016" },
    { group: "student", name: "Juan Ramirez", role: "Undergraduate Researcher (Brandeis)", years: "2016" },
    { group: "student", name: "Sydney Brumfield", role: "Undergraduate Researcher (Wellesley)", years: "2016" },
    { group: "student", name: "Staci Thornton", role: "Undergraduate Researcher (UConn)", years: "2015" },
    { group: "student", name: "Raymond Laboy Morales", role: "Undergraduate Researcher (UNAM)", years: "2015", slug: "raymond-laboy-morales" },
    { group: "student", name: "Ashley Kim", role: "Undergraduate Researcher (UC Berkeley)", years: "2014" },
    { group: "student", name: "Elissa Lin", role: "Undergraduate Researcher (Harvard)", years: "2013" },
    { group: "student", name: "Ana Paula Morales Allende", role: "Undergraduate Researcher (Barnard)", years: "2013" }
  ]
};
