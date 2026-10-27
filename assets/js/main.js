/* MAIR Lab — site interactions */
(function () {
  "use strict";

  /* ---- Header: solid background after scrolling ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      header.classList.toggle("scrolled", open || window.scrollY > 40);
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Publications helpers ---- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function authorList(a, max, also) {
    var html = a.map(function (n) {
      return /^Mair W/.test(n) || (also && also.indexOf(n) !== -1) ? "<b>" + esc(n) + "</b>" : esc(n);
    });
    if (max && html.length > max) {
      var mairIdx = a.findIndex(function (n) { return /^Mair W/.test(n); });
      var keep = html.slice(0, max - 1);
      if (mairIdx >= max - 1) keep.push("…", html[mairIdx]);
      if (mairIdx !== html.length - 1) keep.push("…", html[html.length - 1]);
      return keep.join(", ").replace(/, …/g, " …");
    }
    return html.join(", ");
  }
  function link(p) {
    return p.doi ? "https://doi.org/" + p.doi : "https://pubmed.ncbi.nlm.nih.gov/" + p.pmid + "/";
  }
  function tag(p) {
    if (p.kind === "preprint") return '<span class="tag preprint">Preprint</span>';
    if (p.kind === "review") return '<span class="tag">Review</span>';
    if (p.kind === "commentary") return '<span class="tag">Commentary</span>';
    return "";
  }
  function paperHTML(p, withYear, also) {
    return '<a class="paper" href="' + link(p) + '" target="_blank" rel="noopener">' +
      (withYear ? '<div class="paper-year">' + p.year + "</div>" : "") +
      '<div><div class="paper-title">' + esc(p.title) + tag(p) + "</div>" +
      '<div class="paper-authors">' + authorList(p.authors, also ? 0 : 8, also) + "</div></div>" +
      '<div class="paper-journal">' + esc(p.journal) + "</div></a>";
  }

  /* Featured papers (home page) */
  var featured = document.getElementById("featured-papers");
  if (featured && window.PUBS) {
    featured.innerHTML = window.PUBS.filter(function (p) { return p.featured; })
      .map(function (p) { return paperHTML(p, true); }).join("");
  }

  /* Publication count (home stats) */
  document.querySelectorAll("[data-pub-count]").forEach(function (el) {
    if (window.PUBS) el.textContent = window.PUBS.filter(function (p) { return p.kind !== "preprint"; }).length;
  });

  /* Full list (publications page) */
  var list = document.getElementById("pub-list");
  if (list && window.PUBS) {
    var search = document.getElementById("pub-search");
    var count = document.getElementById("pub-count");
    var chips = document.querySelectorAll(".chip");
    var filter = "all";

    function render() {
      var q = (search.value || "").trim().toLowerCase();
      var items = window.PUBS.filter(function (p) {
        if (filter === "lab" && !/^Mair W/.test(p.authors[p.authors.length - 1] || "") && !/^Mair W/.test(p.authors[0] || "")) return false;
        if (filter === "preprint" && p.kind !== "preprint") return false;
        if (filter === "review" && p.kind !== "review") return false;
        if (!q) return true;
        return (p.title + " " + p.authors.join(" ") + " " + p.journal + " " + p.year).toLowerCase().indexOf(q) !== -1;
      });
      count.textContent = items.length + (items.length === 1 ? " publication" : " publications");
      if (!items.length) { list.innerHTML = '<div class="empty">No publications match “' + esc(q) + "”.</div>"; return; }
      var html = "", year = null;
      items.forEach(function (p) {
        if (p.year !== year) {
          if (year !== null) html += "</div></section>";
          year = p.year;
          html += '<section class="year-group"><h2>' + year + '</h2><div class="paper-list">';
        }
        html += paperHTML(p, false);
      });
      list.innerHTML = html + "</div></section>";
    }

    search.addEventListener("input", render);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        c.setAttribute("aria-pressed", "true");
        filter = c.dataset.filter;
        render();
      });
    });
    render();
  }

  /* Profile page (lab member or alum): papers from people_pubs.js, built by scripts/update_people_pubs.py */
  var mine = document.getElementById("person-pubs");
  if (mine && window.PEOPLE_PUBS) {
    var rec = window.PEOPLE_PUBS[mine.dataset.slug] || { names: [], papers: [] };
    if (!rec.papers.length) {
      mine.innerHTML = '<div class="empty">No publications yet. Papers appear here automatically once they are indexed in PubMed.</div>';
    } else {
      var html = "", yr = null;
      rec.papers.forEach(function (p) {
        if (p.year !== yr) {
          if (yr !== null) html += "</div></section>";
          yr = p.year;
          html += '<section class="year-group"><h2>' + yr + '</h2><div class="paper-list">';
        }
        html += paperHTML(p, false, rec.names);
      });
      mine.innerHTML = html + "</div></section>";
    }
  }

  /* ---- People ---- */
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("");
  }
  var LINK_LABELS = { orcid: "ORCID", scholar: "Scholar", x: "X", bluesky: "Bluesky", linkedin: "LinkedIn", web: "Website" };
  var teamEl = document.getElementById("team");
  if (teamEl && window.PEOPLE) {
    teamEl.innerHTML = window.PEOPLE.current.map(function (m) {
      var pic = m.photo
        ? '<div class="portrait"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></div>'
        : '<div class="portrait avatar" aria-hidden="true"><span>' + esc(initials(m.name)) + "</span></div>";
      var links = m.links ? '<div class="member-links">' + Object.keys(m.links).map(function (k) {
        return '<a href="' + esc(m.links[k]) + '" target="_blank" rel="noopener">' + (LINK_LABELS[k] || k) + "</a>";
      }).join("") + "</div>" : "";
      var name = '<div class="member-name">' + esc(m.name) + "</div>";
      if (m.slug) {
        pic = '<a href="people/' + esc(m.slug) + '.html" tabindex="-1" aria-hidden="true">' + pic + "</a>";
        name = '<a class="member-name" href="people/' + esc(m.slug) + '.html">' + esc(m.name) + "</a>";
      }
      return '<div class="member reveal in">' + pic + name +
        '<div class="member-role">' + esc(m.role) + (m.since ? " · since " + esc(m.since) : "") + "</div>" +
        (m.focus ? '<div class="member-focus">' + esc(m.focus) + "</div>" : "") + links + "</div>";
    }).join("");
  }
  var alumniEl = document.getElementById("alumni");
  if (alumniEl && window.PEOPLE) {
    var GROUPS = [
      ["postdoc", "Postdoctoral fellows"], ["phd", "Ph.D. students"],
      ["staff", "Research staff"], ["student", "Visiting, post-baccalaureate and undergraduate researchers"]
    ];
    function endYear(y) { var m = String(y || "").match(/\d{4}/g); return m ? +m[m.length - 1] : 0; }
    function startYear(y) { var m = String(y || "").match(/\d{4}/); return m ? +m[0] : 0; }
    alumniEl.innerHTML = GROUPS.map(function (g) {
      var list = window.PEOPLE.alumni.filter(function (m) { return m.group === g[0]; }).sort(function (a, b) {
        return endYear(b.years) - endYear(a.years) || startYear(b.years) - startYear(a.years) || a.name.localeCompare(b.name);
      });
      if (!list.length) return "";
      return '<div class="alumni-group"><h3 class="alumni-head">' + g[1] + ' <span>' + list.length + "</span></h3><ul class=\"alumni\">" +
        list.map(function (m) {
          var detail = [m.role, m.years].filter(Boolean).join(", ");
          var name = m.slug ? '<a href="people/' + esc(m.slug) + '.html">' + esc(m.name) + "</a>" : esc(m.name);
          return "<li>" + name + "<span>" + esc(detail) + (m.now ? " → " + esc(m.now) : "") + "</span></li>";
        }).join("") + "</ul></div>";
    }).join("");
  }
  document.querySelectorAll("[data-team-count]").forEach(function (el) {
    if (window.PEOPLE) el.textContent = window.PEOPLE.current.filter(function (m) { return !/dog/i.test(m.role); }).length + 1;
  });
  document.querySelectorAll("[data-alumni-count]").forEach(function (el) {
    if (window.PEOPLE) el.textContent = window.PEOPLE.alumni.length;
  });

  /* ---- News ---- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(d) {
    var p = String(d).split("-");
    return p[1] ? MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }
  var PLATFORMS = { spotify: "Spotify", apple: "Apple Podcasts", youtube: "YouTube" };
  function newsHTML(n) {
    var ext = /^https?:/.test(n.url);
    var meta = '<div class="news-meta"><span class="news-type">' + esc(n.type) + "</span><span>" + esc(fmtDate(n.date)) + "</span></div>";
    var body = (n.blurb ? '<p class="news-blurb">' + esc(n.blurb) + "</p>" : "");
    if (n.links) {
      var btns = Object.keys(PLATFORMS).filter(function (k) { return n.links[k]; }).map(function (k) {
        return '<a class="listen listen-' + k + '" href="' + esc(n.links[k]) + '" target="_blank" rel="noopener">' + PLATFORMS[k] + "</a>";
      }).join("");
      return '<div class="news-item reveal in">' + meta +
        '<a class="news-title" href="' + esc(n.url) + '" target="_blank" rel="noopener">' + esc(n.title) + "</a>" + body +
        '<div class="news-source">' + esc(n.source) + "</div>" +
        '<div class="listen-row"><span>Listen on</span>' + btns + "</div></div>";
    }
    return '<a class="news-item reveal in" href="' + esc(n.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + meta +
      '<div class="news-title">' + esc(n.title) + "</div>" + body +
      '<div class="news-source">' + esc(n.source) + ' <span class="arrow">↗</span></div></a>';
  }
  if (window.NEWS) {
    // newest first; a bare year ("2026") sorts after dated items from that year
    var key = function (n) { var p = String(n.date).split("-"); return (+p[0]) * 100 + (p[1] ? +p[1] : 0); };
    window.NEWS = window.NEWS.map(function (n, i) { return [n, i]; })
      .sort(function (a, b) { return key(b[0]) - key(a[0]) || a[1] - b[1]; }).map(function (x) { return x[0]; });
  }
  function listenButtons(n) {
    return Object.keys(PLATFORMS).filter(function (k) { return n.links && n.links[k]; }).map(function (k) {
      return '<a class="listen listen-' + k + '" href="' + esc(n.links[k]) + '" target="_blank" rel="noopener">' + PLATFORMS[k] + "</a>";
    }).join("");
  }
  function featuredHTML(n) {
    return '<div class="featured-listen reveal in"><div class="fl-text"><div class="eyebrow">Featured listen · ' + esc(n.source) + " · " + esc(fmtDate(n.date)) + "</div>" +
      '<h3 class="fl-title">' + esc(n.title) + "</h3>" + (n.blurb ? "<p>" + esc(n.blurb) + "</p>" : "") +
      '<div class="listen-row"><span>Listen on</span>' + listenButtons(n) + "</div></div>" +
      '<svg class="fl-wave" viewBox="0 0 400 160" aria-hidden="true"><defs><linearGradient id="flg" x1="0" x2="1"><stop offset="0" stop-color="#7FE3C6"/><stop offset=".45" stop-color="#6E8DF0"/><stop offset=".7" stop-color="#A27DF0"/><stop offset="1" stop-color="#EBA43C"/></linearGradient></defs>' +
      '<path d="' + (function () { var d = "", n2 = 220; for (var i = 0; i <= n2; i++) { var t = i / n2; d += (i ? " L" : "M") + (10 + 380 * t).toFixed(1) + " " + (80 - 62 * Math.exp(-1.9 * t) * Math.cos(2 * Math.PI * 5 * t)).toFixed(1); } return d; })() +
      '" fill="none" stroke="url(#flg)" stroke-width="4" stroke-linecap="round"/></svg></div>';
  }
  var featuredNews = window.NEWS ? window.NEWS.filter(function (n) { return n.featured; })[0] : null;
  var flHome = document.getElementById("featured-listen");
  if (flHome && featuredNews) flHome.innerHTML = featuredHTML(featuredNews);
  var flNews = document.getElementById("news-featured");
  if (flNews && featuredNews) flNews.innerHTML = featuredHTML(featuredNews);
  var newsLatest = document.getElementById("news-latest");
  if (newsLatest && window.NEWS) newsLatest.innerHTML = window.NEWS.filter(function (n) { return !n.featured; }).slice(0, 3).map(newsHTML).join("");
  var newsAll = document.getElementById("news-all");
  if (newsAll && window.NEWS) {
    var newsChips = document.querySelectorAll("[data-news-filter]");
    function renderNews(type) {
      if (flNews) flNews.style.display = (type === "all" || type === "Podcast") ? "" : "none";
      newsAll.innerHTML = window.NEWS.filter(function (n) { return !(n.featured && flNews) && (type === "all" || n.type === type); }).map(newsHTML).join("");
    }
    newsChips.forEach(function (c) {
      c.addEventListener("click", function () {
        newsChips.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        c.setAttribute("aria-pressed", "true");
        renderNews(c.dataset.newsFilter);
      });
    });
    renderNews("all");
  }

  /* ---- Contact form ----------------------------------------------------
     Messages are delivered by Web3Forms (https://web3forms.com) to
     wmair@hsph.harvard.edu (recipient set in the Web3Forms dashboard).
     Subjects start "MAIR Lab website –". The sender name deliberately has
     no web address in it, so Harvard's spam filter doesn't flag it.        */
  var CONTACT_FORM_KEY = "fe2d9e97-2d71-44a4-8501-87e318278dcf";

  var form = document.getElementById("contact-form");
  if (form) {
    var TOPICS = {
      postdoc: "Postdoc position", phd: "Graduate rotation / PhD", ra: "Research assistant or student project",
      media: "Media enquiry", collab: "Collaboration", giving: "Supporting the lab", speaking: "Speaking invitation", consulting: "Consulting or advisory"
    };
    var HINTS = {
      "Postdoc position": "Please include a short note on the questions that excite you, and the names of three references. You can share a link to your CV.",
      "Graduate rotation / PhD": "Let us know your program and when you’re hoping to rotate.",
      "Media enquiry": "Please include your outlet and deadline.",
      "Consulting or advisory": "Please include your organization and a short description of what you have in mind.",
      "Supporting the lab": "Thank you. Will will be in touch personally."
    };
    var topicSel = form.querySelector("#cf-topic"), hint = form.querySelector("#cf-hint"), status = form.querySelector("#cf-status");
    var wanted = TOPICS[new URLSearchParams(location.search).get("topic")];
    if (wanted) topicSel.value = wanted;
    function showHint() { hint.textContent = HINTS[topicSel.value] || ""; }
    topicSel.addEventListener("change", showHint); showHint();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = Object.fromEntries(new FormData(form).entries());
      if (d.botcheck) return;
      if (!d.name || !d.email || !d.message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
        status.className = "form-status err"; status.textContent = "Please fill in your name, a valid email and a message."; return;
      }
      if (!CONTACT_FORM_KEY) {
        status.className = "form-status err"; status.textContent = "The contact form isn’t connected yet. Please try again soon."; return;
      }
      var btn = form.querySelector("button"); btn.disabled = true;
      status.className = "form-status"; status.textContent = "Sending…";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: CONTACT_FORM_KEY,
          subject: "MAIR Lab website – " + d.topic + " – " + d.name,
          from_name: "MAIR Lab website",
          replyto: d.email,
          name: d.name, email: d.email, organization: d.organization || "", topic: d.topic, message: d.message
        })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (!res.success) throw new Error(res.message || "failed");
        form.reset(); showHint();
        status.className = "form-status ok"; status.textContent = "Thanks, your message has been sent. We’ll be in touch.";
      }).catch(function () {
        status.className = "form-status err"; status.textContent = "Sorry, something went wrong. Please try again in a moment.";
      }).then(function () { btn.disabled = false; });
    });
  }

  /* ---- Lab age clock: counting up from 11.1.11, 11:00 am Boston time ---- */
  var clock = document.getElementById("age-clock");
  if (clock) {
    var START_MS = Date.UTC(2011, 10, 1, 15, 0, 0);          // 11:00 EDT = 15:00 UTC
    var START = { y: 2011, mo: 11, d: 1, h: 11, mi: 0, s: 0 }; // Boston wall clock
    var bostonParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", hourCycle: "h23",
      year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
    });
    var nf = new Intl.NumberFormat("en-US");
    var cells = {};
    clock.querySelectorAll("[data-u]").forEach(function (b) { cells[b.dataset.u] = b; });
    function daysIn(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); } // m is 1-12

    function tick() {
      var now = new Date(), p = {};
      bostonParts.formatToParts(now).forEach(function (x) { if (x.type !== "literal") p[x.type] = +x.value; });
      var y = p.year - START.y, mo = p.month - START.mo, d = p.day - START.d,
          h = p.hour - START.h, mi = p.minute - START.mi, s = p.second - START.s;
      if (s < 0) { s += 60; mi--; }
      if (mi < 0) { mi += 60; h--; }
      if (h < 0) { h += 24; d--; }
      if (d < 0) { var pm = p.month - 1 || 12, py = pm === 12 ? p.year - 1 : p.year; d += daysIn(py, pm); mo--; }
      if (mo < 0) { mo += 12; y--; }
      var v = { y: y, mo: mo, d: d, h: h, mi: mi, s: s };
      Object.keys(v).forEach(function (k) {
        var txt = (k === "y" || k === "mo" || k === "d") ? String(v[k]) : String(v[k]).padStart(2, "0");
        if (cells[k] && cells[k].textContent !== txt) cells[k].textContent = txt;
      });
      var ms = now.getTime() - START_MS;
      document.getElementById("age-days").textContent = nf.format(Math.floor(ms / 86400000));
      document.getElementById("age-secs").textContent = nf.format(Math.floor(ms / 1000));
    }
    tick();
    setInterval(tick, 250);
  }

  /* ---- Homeodynamics figure (static SVG) ---- */
  document.querySelectorAll(".homeo-fig").forEach(function (fig) {
    var wave = fig.querySelector("#homeo-wave"), env = fig.querySelector("#homeo-env");
    if (!wave) return;
    var x0 = 66, x1 = 596, cy = 158, a0 = 128, k = 1.9, cycles = 8, n = 400, d = "", top = [], bot = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = x0 + (x1 - x0) * t, a = a0 * Math.exp(-k * t);
      d += (i ? " L" : "M") + x.toFixed(1) + " " + (cy - a * Math.cos(2 * Math.PI * cycles * t)).toFixed(1);
      if (i % 10 === 0) { top.push(x.toFixed(1) + " " + (cy - a).toFixed(1)); bot.unshift(x.toFixed(1) + " " + (cy + a).toFixed(1)); }
    }
    wave.setAttribute("d", d);
    env.setAttribute("d", "M" + top.join(" L") + " L" + bot.join(" L") + "Z");
  });

  /* ---- Hero: homeodynamics wave (wide dynamic range in youth, narrowing with age) ---- */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var STOPS = ["#7FE3C6", "#55B4EA", "#6E8DF0", "#A27DF0", "#D39A8A", "#EBA43C"];
    var W, H, geo, grad, dots = [];

    function build() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var narrow = W < 760;
      geo = narrow
        ? { x0: W * 0.04, x1: W * 1.02, cy: H * 0.175, a0: H * 0.085, cycles: 6 }
        : { x0: W * 0.36, x1: W * 1.02, cy: H * 0.40, a0: H * 0.27, cycles: 7.5 };
      grad = ctx.createLinearGradient(geo.x0, 0, geo.x1, 0);
      STOPS.forEach(function (c, i) { grad.addColorStop(i / (STOPS.length - 1), c); });
      dots = [];
      for (var j = 0; j < 70; j++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: 0.5 + Math.random() * 1.3, p: Math.random() * 6 });
    }

    function y(t, phase, amp) {
      return geo.cy - amp * geo.a0 * Math.exp(-1.9 * t) * Math.cos(2 * Math.PI * geo.cycles * t - phase);
    }

    function trace(phase, amp) {
      ctx.beginPath();
      var n = 420;
      for (var i = 0; i <= n; i++) {
        var t = i / n, x = geo.x0 + (geo.x1 - geo.x0) * t;
        i ? ctx.lineTo(x, y(t, phase, amp)) : ctx.moveTo(x, y(t, phase, amp));
      }
    }

    function draw(ms) {
      var tm = reduce ? 0 : ms / 1000;
      ctx.clearRect(0, 0, W, H);

      dots.forEach(function (d) {
        ctx.fillStyle = "rgba(190,220,255," + (0.05 + 0.06 * Math.sin(tm * 0.8 + d.p)) + ")";
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
      });

      // envelope (the narrowing dynamic range)
      ctx.beginPath();
      for (var i = 0; i <= 60; i++) {
        var t = i / 60, x = geo.x0 + (geo.x1 - geo.x0) * t;
        ctx.lineTo(x, geo.cy - geo.a0 * Math.exp(-1.9 * t));
      }
      for (var k = 60; k >= 0; k--) {
        var t2 = k / 60, x2 = geo.x0 + (geo.x1 - geo.x0) * t2;
        ctx.lineTo(x2, geo.cy + geo.a0 * Math.exp(-1.9 * t2));
      }
      ctx.closePath();
      ctx.globalAlpha = 0.07; ctx.fillStyle = grad; ctx.fill();

      var phase = tm * 0.9, breathe = 1 + 0.04 * Math.sin(tm * 0.7);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = grad;

      // faint echoes
      ctx.globalAlpha = 0.16; ctx.lineWidth = 1.5;
      trace(phase + 0.9, breathe * 0.82); ctx.stroke();
      trace(phase - 0.9, breathe * 0.66); ctx.stroke();

      // main wave: glow, body, core
      ctx.globalAlpha = 0.10; ctx.lineWidth = 22; trace(phase, breathe); ctx.stroke();
      ctx.globalAlpha = 0.28; ctx.lineWidth = 9; trace(phase, breathe); ctx.stroke();
      ctx.globalAlpha = 1; ctx.lineWidth = 3.4; trace(phase, breathe); ctx.stroke();
      ctx.globalAlpha = 1;

      if (!reduce) requestAnimationFrame(draw);
    }

    build();
    requestAnimationFrame(draw);
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 150); });
  }
})();
