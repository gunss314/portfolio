/* ============================================================
   MAIN APP — nav, theme, typed text, reveal, certificates,
   video modal, contact form, back-to-top
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ================= THEME ================= */
  var themeBtn = $("#themeToggle");
  var stored = null;
  try { stored = localStorage.getItem("gs-theme"); } catch (e) {}
  if (stored) {
    document.documentElement.setAttribute("data-theme", stored);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.documentElement.setAttribute("data-theme", "light");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", cur);
      try { localStorage.setItem("gs-theme", cur); } catch (e) {}
    });
  }

  /* ================= PRELOADER ================= */
  var preloader = $("#preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("done");
    setTimeout(function () { if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 800);
  }
  window.addEventListener("load", function () { setTimeout(hidePreloader, 350); });
  setTimeout(hidePreloader, 2600); // safety fallback

  /* ================= NAVBAR ================= */
  var navbar = $("#navbar");
  var navToggle = $("#navToggle");
  var mobileMenu = $("#mobileMenu");
  var lastY = window.scrollY;

  function onScrollNav() {
    var y = window.scrollY;
    if (y > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    // auto-hide on scroll down, show on scroll up
    if (y > lastY && y > 300) navbar.classList.add("hidden");
    else navbar.classList.remove("hidden");
    lastY = y;
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
      navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
  }
  $$("#mobileMenu a").forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* ================= SCROLLSPY ================= */
  var sections = $$("section[data-nav]");
  var navLinks = $$(".nav-link");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.getAttribute("data-nav");
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === "#" + id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { spy.observe(s); });

  /* ================= TYPED TEXT ================= */
  var typedEl = $("#typed");
  var words = ["Video Editing", "Content Creation", "Canva Design", "Google Ads"];
  if (typedEl) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      typedEl.textContent = words[0];
    } else {
      var wi = 0, ci = 0, deleting = false;
      (function tick() {
        var word = words[wi];
        typedEl.textContent = word.slice(0, ci);
        var delay;
        if (!deleting) {
          ci++;
          delay = 75;
          if (ci > word.length) { deleting = true; delay = 1500; }
        } else {
          ci--;
          delay = 38;
          if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 350; }
        }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ================= SCROLL REVEAL ================= */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(function (el, i) {
    el.style.setProperty("--d", (i % 6) * 0.07 + "s");
    revealObs.observe(el);
  });

  // skill bars animate when their card becomes visible
  var skillObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  $$(".skill-card").forEach(function (el) { skillObs.observe(el); });

  /* ================= CERTIFICATES ================= */
  var CERTS = window.GS_CERTIFICATES || [];
  var certGrid = $("#certGrid");
  var certModal = $("#certModal");
  var certTitle = $("#certModalTitle");
  var certMeta = $("#certModalMeta");

  function resolveCertFile(file) {
    if (!file) return null;
    return "assets/certificates/" + file;
  }

  if (certGrid) {
    CERTS.forEach(function (cert, index) {
      var card = document.createElement("article");
      card.className = "glass-card cert-card reveal";

      var media = document.createElement("div");
      media.className = "cert-media";

      if (cert.file) {
        var isPdf = cert.file.toLowerCase().slice(-4) === ".pdf";
        if (!isPdf) {
          var img = document.createElement("img");
          img.src = resolveCertFile(cert.thumb || cert.file);
          img.alt = cert.title + " — certificate";
          img.decoding = "async";
          img.onerror = function () { showFallback(); };
          media.appendChild(img);
        } else {
          showFallback();
        }
      } else {
        showFallback();
      }

      function showFallback() {
        var fb = document.createElement("div");
        fb.className = "cert-fallback";
        fb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8m-4-4v4M6 3h12v6a6 6 0 0 1-12 0z"/><path d="M6 5H3v2a4 4 0 0 0 4 4M18 5h3v2a4 4 0 0 1-4 4"/></svg>';
        if (media.firstChild) media.removeChild(media.firstChild);
        media.appendChild(fb);
      }

      var hint = document.createElement("button");
      hint.className = "cert-zoom-hint";
      hint.type = "button";
      hint.innerHTML = "<span>🔍</span><em>Preview</em>";
      hint.style.background = "none";
      hint.addEventListener("click", function () { openCert(cert); });
      media.appendChild(hint);

      var body = document.createElement("div");
      body.className = "cert-body";

      var h3 = document.createElement("h3");
      h3.textContent = cert.title;
      body.appendChild(h3);

      if (cert.org) {
        var orgEl = document.createElement("p");
        orgEl.className = "cert-org";
        orgEl.innerHTML = "<span>🏛️</span>";
        orgEl.appendChild(document.createTextNode(cert.org));
        body.appendChild(orgEl);
      }
      if (cert.date) {
        var dateEl = document.createElement("p");
        dateEl.className = "cert-date";
        dateEl.innerHTML = "<span>🗓️</span>";
        dateEl.appendChild(document.createTextNode(cert.date));
        body.appendChild(dateEl);
      }
      if (cert.credential) {
        var credEl = document.createElement("p");
        credEl.className = "cert-date";
        credEl.innerHTML = "<span>🔖</span>";
        credEl.appendChild(document.createTextNode("ID: " + cert.credential));
        body.appendChild(credEl);
      }

      var foot = document.createElement("div");
      foot.className = "project-foot";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline btn-sm";
      btn.textContent = "View Certificate";
      btn.addEventListener("click", function () { openCert(cert); });
      foot.appendChild(btn);
      body.appendChild(foot);

      card.appendChild(media);
      card.appendChild(body);
      certGrid.appendChild(card);
      revealObs.observe(card);
    });
  }

  /* ---------- certificate lightbox with zoom & pan ---------- */
  var lightbox = certModal; // #certModal is the lightbox container
  var lbCanvas = $("#lbCanvas");
  var lbStage = $("#lbStage");
  var lbHint = $("#lbHint");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var withFile = CERTS.filter(function (c) { return c.file; });
  var lbIndex = 0;
  var zoom = 1, minZoom = 0.5, maxZoom = 4, panX = 0, panY = 0;

  function applyZoom(animate) {
    var img = lbCanvas.querySelector("img");
    if (!img) return;
    img.classList.toggle("no-anim", animate === false);
    img.style.transform = "translate(" + panX + "px, " + panY + "px) scale(" + zoom + ")";
    $("#zoomLevel").textContent = Math.round(zoom * 100) + "%";
  }

  function resetZoom() {
    zoom = 1; panX = 0; panY = 0;
    applyZoom();
  }
  function clampPan() {
    var img = lbCanvas.querySelector("img");
    if (!img) return;
    if (zoom <= 1) { panX = 0; panY = 0; return; }
    var r = img.getBoundingClientRect();
    var maxX = Math.max(0, (r.width - lbStage.clientWidth) / 2 + 40);
    var maxY = Math.max(0, (r.height - lbStage.clientHeight) / 2 + 40);
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
  }

  function setLbMeta(cert) {
    certTitle.textContent = cert.title;
    var metaBits = [];
    if (cert.org) metaBits.push(cert.org);
    if (cert.date) metaBits.push(cert.date);
    if (cert.credential) metaBits.push("ID: " + cert.credential);
    certMeta.textContent = metaBits.join(" · ") || "Certificate — Gunasurya S";
  }

  function showCertInLightbox(cert) {
    lbIndex = withFile.indexOf(cert);
    var hasNav = withFile.length > 1;
    lbPrev.style.display = hasNav ? "" : "none";
    lbNext.style.display = hasNav ? "" : "none";

    lbCanvas.innerHTML = "";
    lbCanvas.classList.remove("placeholder");
    var img = document.createElement("img");
    img.src = resolveCertFile(cert.file);
    img.alt = cert.title + " — full certificate";
    lbCanvas.appendChild(img);
    resetZoom();

    var openTab = $("#certOpenNewTab");
    var download = $("#certDownload");
    if (cert.pdf) {
      var pdfUrl = resolveCertFile(cert.pdf);
      openTab.href = pdfUrl;
      download.href = pdfUrl;
      download.setAttribute("download", cert.pdf.split("/").pop());
      lbHint.textContent = "Scroll to zoom · drag to pan · double-click for 100% · original PDF below";
    } else {
      openTab.href = resolveCertFile(cert.file);
      download.href = resolveCertFile(cert.file);
      download.setAttribute("download", cert.file);
      lbHint.textContent = "Scroll to zoom · drag to pan · double-click to toggle 1:1";
    }
    openTab.style.display = "";
    download.style.display = "";
  }

  function openCert(cert) {
    if (!certModal) return;
    setLbMeta(cert);
    if (cert.file) {
      showCertInLightbox(cert);
    } else {
      lbIndex = -1;
      lbPrev.style.display = "none";
      lbNext.style.display = "none";
      lbCanvas.innerHTML = "";
      lbCanvas.classList.add("placeholder");
      var ph = document.createElement("div");
      ph.className = "video-placeholder";
      ph.innerHTML = '<span class="vp-ico">📜</span><h4>Certificate file not added yet</h4><p>This is a real certificate from my resume — the file just hasn\'t been uploaded to the site yet.</p>';
      lbCanvas.appendChild(ph);
      lbHint.textContent = "";
      $("#certOpenNewTab").style.display = "none";
      $("#certDownload").style.display = "none";
    }
    openModal(certModal);
  }

  /* ---------- lightbox interactions ---------- */
  if (lightbox && lbCanvas) {
    function step(dir) {
      if (lbIndex < 0 || withFile.length === 0) return;
      lbIndex = (lbIndex + dir + withFile.length) % withFile.length;
      var cert = withFile[lbIndex];
      setLbMeta(cert);
      showCertInLightbox(cert);
    }
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });

    $("#zoomIn").addEventListener("click", function () {
      zoom = Math.min(maxZoom, zoom * 1.25); clampPan(); applyZoom();
    });
    $("#zoomOut").addEventListener("click", function () {
      zoom = Math.max(minZoom, zoom / 1.25); clampPan(); applyZoom();
    });
    $("#zoomReset").addEventListener("click", resetZoom);

    lbStage.addEventListener("wheel", function (e) {
      if (!lbCanvas.querySelector("img")) return;
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      var newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * factor));
      if (newZoom === zoom) return;
      var rect = lbStage.getBoundingClientRect();
      var cx = e.clientX - rect.left - rect.width / 2;
      var cy = e.clientY - rect.top - rect.height / 2;
      var ratio = newZoom / zoom;
      panX = cx - (cx - panX) * ratio;
      panY = cy - (cy - panY) * ratio;
      zoom = newZoom;
      clampPan(); applyZoom(false);
    }, { passive: false });

    var dragging = false, startX = 0, startY = 0, sx = 0, sy = 0;
    lbStage.addEventListener("pointerdown", function (e) {
      if (!lbCanvas.querySelector("img")) return;
      dragging = true; startX = e.clientX; startY = e.clientY; sx = panX; sy = panY;
      lbStage.classList.add("dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panX = sx + (e.clientX - startX);
      panY = sy + (e.clientY - startY);
      clampPan(); applyZoom(false);
    });
    window.addEventListener("pointerup", function () {
      dragging = false;
      lbStage.classList.remove("dragging");
    });

    lbStage.addEventListener("dblclick", function (e) {
      if (!lbCanvas.querySelector("img")) return;
      if (zoom === 1) {
        zoom = 2;
        var rect = lbStage.getBoundingClientRect();
        panX = rect.width / 2 - (e.clientX - rect.left);
        panY = rect.height / 2 - (e.clientY - rect.top);
        clampPan(); applyZoom();
      } else {
        resetZoom();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "+" || e.key === "=") { zoom = Math.min(maxZoom, zoom * 1.25); clampPan(); applyZoom(); }
      if (e.key === "-") { zoom = Math.max(minZoom, zoom / 1.25); clampPan(); applyZoom(); }
      if (e.key === "0") resetZoom();
    });
  }

  /* ================= VIDEO MODAL ================= */
  var videoModal = $("#videoModal");
  $$(".ve-thumb").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(videoModal);
    });
  });

  /* ================= MODAL PLUMBING ================= */
  function openModal(m) {
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(m) {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $$(".modal, .lightbox").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close-modal")) closeModal(m);
    });
    $$("[data-close-modal]", m).forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(m); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      $$(".modal.open, .lightbox.open").forEach(closeModal);
      closeMenu();
    }
  });

  /* ================= CONTACT FORM ================= */
  var form = $("#contactForm");
  if (form) {
    var sendBtn = $("#sendBtn");
    var statusEl = $("#formStatus");
    var sending = false;

    function setBtnState(state) {
      sendBtn.classList.toggle("is-loading", state === "sending");
      sendBtn.disabled = state === "sending";
      sendBtn.setAttribute("aria-busy", state === "sending" ? "true" : "false");
      var label = sendBtn.querySelector("span.btn-label");
      if (label) label.textContent =
        state === "sending" ? "Sending…" :
        state === "sent" ? "Sent ✓" : "Send Message";
    }

    function markInvalid(el) {
      el.classList.add("invalid");
      var clear = function () { el.classList.remove("invalid"); el.removeEventListener("input", clear); };
      el.addEventListener("input", clear);
      setTimeout(function () { el.classList.remove("invalid"); }, 3000);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var valid = true;

      if (name.length < 2) { markInvalid(form.name); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { markInvalid(form.email); valid = false; }
      if (message.length < 10) { markInvalid(form.message); valid = false; }

      if (!valid) {
        statusEl.textContent = "Please fill in all fields correctly.";
        statusEl.className = "form-status err";
        return;
      }

      sending = true;
      setBtnState("sending");
      statusEl.textContent = "Sending…";
      statusEl.className = "form-status";

      var payload = {
        name: name,
        email: email,
        message: message,
        _subject: "New portfolio message from " + name,
        _template: "table",
        _captcha: "false"
      };

      fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          if (data && (data.success === "true" || data.success === true)) {
            setBtnState("sent");
            statusEl.innerHTML = "✅ <strong>Message sent successfully! I'll get back to you soon.</strong>";
            statusEl.className = "form-status ok";
            form.reset();
            setTimeout(function () { setBtnState("idle"); sending = false; }, 3500);
          } else {
            throw new Error("failed");
          }
        })
        .catch(function () {
          sending = false;
          setBtnState("idle");
          statusEl.textContent = "Something went wrong. Please try again or contact me directly.";
          statusEl.className = "form-status err";
        });
    });
  }

  /* ================= BACK TO TOP + YEAR ================= */
  var toTop = $("#toTop");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 600) toTop.classList.add("show");
    else toTop.classList.remove("show");
  }, { passive: true });
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
