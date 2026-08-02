/* ============================================================
   A SECRET JOURNEY — SCRIPT
   Vanilla JS. Reads window.CONFIG (config.js) and drives the
   whole experience: content injection, on-load reveal, envelope
   opening, letter, scroll reveals, particles, parallax & music.
   ============================================================ */

(() => {
  "use strict";

  const CONFIG = window.CONFIG || {};
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -------------------- tiny helpers -------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const setText = (id, value) => {
    const el = typeof id === "string" ? $("#" + id) : id;
    if (el && value != null) el.textContent = value;
  };

  /* ==========================================================
     1. THEME — push config colours into CSS variables
     ========================================================== */
  function applyTheme() {
    const t = CONFIG.theme;
    if (!t) return;
    const root = document.documentElement.style;
    if (t.accent) root.setProperty("--accent", t.accent);
    if (t.accentSoft) root.setProperty("--accent-soft", t.accentSoft);
    if (t.accentDeep) root.setProperty("--accent-deep", t.accentDeep);
    if (t.ink) root.setProperty("--ink", t.ink);
    if (t.bg) root.setProperty("--bg", t.bg);
  }

  /* ==========================================================
     2. CONTENT — inject everything from config
     ========================================================== */
  function buildContent() {
    const w = CONFIG.welcome || {};
    setText("welcomeEyebrow", w.eyebrow);
    setText("welcomeSubtitle", w.subtitle);

    // Masked, line-by-line hero title
    const titleEl = $("#welcomeTitle");
    const lines = (w.title || "A Secret\nJourney").split("\n");
    titleEl.innerHTML = lines
      .map((line) => `<span class="line"><span>${escapeHtml(line)}</span></span>`)
      .join("");

    setText("openBtnLabel", w.button || "Open My Letter");

    // Letter
    const l = CONFIG.letter || {};
    setText("letterHeading", l.heading);
    const bodyEl = $("#letterBody");
    bodyEl.innerHTML = (l.body || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
    setText("letterSignOff", l.signOff);
    setText("letterSignature", l.signature);

    // Envelope seal initial
    const name = CONFIG.recipient || "";
    if (name) $(".envelope__seal").textContent = name.charAt(0).toUpperCase();

    // Gallery
    const g = CONFIG.gallery || {};
    setText("galleryIntro", g.intro);
    buildGallery(g.photos || []);

    // Marquee
    buildMarquee();

    // Finale
    const f = CONFIG.finale || {};
    setText("finaleEyebrow", f.eyebrow);
    setText("finaleTitle", f.title);
    setText("finaleMessage", f.message);
    setText("finaleSignature", f.signature);

    setText(
      "footerText",
      `Made with love${name ? " · for " + name : ""} · A Secret Journey`
    );
    document.title = name ? `A Secret Journey · ${name}` : "A Secret Journey";
  }

  function buildGallery(photos) {
    const grid = $("#galleryGrid");
    grid.innerHTML = "";
    photos.forEach((p, i) => {
      const fig = document.createElement("figure");
      fig.className = "photo reveal";
      fig.dataset.reveal = "";

      const img = document.createElement("img");
      img.className = "photo__img";
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = p.caption || `Memory ${i + 1}`;
      img.src = p.src;

      // Graceful fallback → elegant placeholder frame
      img.addEventListener(
        "error",
        () => {
          fig.classList.add("photo--empty");
          const ph = document.createElement("div");
          ph.className = "photo__placeholder";
          ph.innerHTML = `
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
                 stroke="currentColor" stroke-width="1.1">
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <circle cx="8.5" cy="9.5" r="1.6"/>
              <path d="M4 18l5-5 4 4 3-3 4 4"/>
            </svg>
            <span>${escapeHtml(p.caption || "Add your photo here")}</span>`;
          fig.appendChild(ph);
        },
        { once: true }
      );

      const cap = document.createElement("figcaption");
      cap.className = "photo__caption";
      cap.textContent = p.caption || "";

      fig.append(img, cap);
      grid.appendChild(fig);
    });
  }

  function buildMarquee() {
    const track = $("#marqueeTrack");
    const name = CONFIG.recipient || "You";
    const words = ["A Secret Journey", `For ${name}`, "Always", "With Love"];
    // duplicated once for a seamless -50% loop
    const html = words.map((s) => `<span>${escapeHtml(s)}</span>`).join("");
    track.innerHTML = html + html;
  }

  function escapeHtml(str) {
    return String(str).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }

  /* ==========================================================
     3. SCROLL REVEAL — IntersectionObserver
     ========================================================== */
  function initReveals() {
    const items = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // gentle stagger for grouped items
            setTimeout(
              () => {
                entry.target.classList.add("is-in");
                if (entry.target.classList.contains("photo"))
                  entry.target.classList.add("is-in");
              },
              (idx % 3) * 90
            );
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ==========================================================
     4. PARTICLES — slow rose-gold dust (canvas)
     ========================================================== */
  function initParticles() {
    const canvas = $("#particles");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles, raf, running = true;

    const accent = (CONFIG.theme && CONFIG.theme.accentSoft) || "#f3d7c3";

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 26000); // scale to screen, stays light
      particles = Array.from({ length: Math.min(count, 46) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.14 + 0.03),
        vx: (Math.random() - 0.5) * 0.06,
        a: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.02;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(accent, alpha);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    }

    function hexToRgba(hex, a) {
      const m = hex.replace("#", "");
      const bigint = parseInt(
        m.length === 3 ? m.split("").map((c) => c + c).join("") : m,
        16
      );
      const r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;
      return `rgba(${r},${g},${b},${a})`;
    }

    resize();
    draw();
    window.addEventListener("resize", debounce(resize, 200), { passive: true });
    // pause when tab hidden — saves battery, keeps 60fps
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    });
  }

  function debounce(fn, ms) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  }

  /* ==========================================================
     5. PARALLAX — subtle glow drift on scroll (transform only)
     ========================================================== */
  function initParallax() {
    if (reduceMotion) return;
    const a = $(".bg__glow--a");
    const b = $(".bg__glow--b");
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (a) a.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
          if (b) b.style.transform = `translate3d(0, ${y * -0.05}px, 0)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ==========================================================
     6. MUSIC
     ========================================================== */
  const audio = $("#audio");
  const musicBtn = $("#musicToggle");
  let musicReady = false;

  function initMusic() {
    const m = CONFIG.music || {};
    if (!m.src) return; // no track configured → keep hidden
    audio.src = m.src;
    musicReady = true;
    musicBtn.hidden = false;

    musicBtn.addEventListener("click", toggleMusic);
  }

  function toggleMusic() {
    if (!musicReady) return;
    if (audio.paused) playMusic();
    else pauseMusic();
  }

  function playMusic() {
    if (!musicReady) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {}); // autoplay may be blocked; ignore
    musicBtn.classList.add("is-playing");
    musicBtn.setAttribute("aria-pressed", "true");
    musicBtn.setAttribute("aria-label", "Pause background music");
  }

  function pauseMusic() {
    audio.pause();
    musicBtn.classList.remove("is-playing");
    musicBtn.setAttribute("aria-pressed", "false");
    musicBtn.setAttribute("aria-label", "Play background music");
  }

  /* ==========================================================
     7. THE OPENING SEQUENCE
     ========================================================== */
  const envelope = $("#envelope");
  const openBtn = $("#openBtn");
  const cta = $("#openBtn");
  const letterStage = $("#letterStage");
  const journey = $("#journey");
  let opened = false;

  function openLetter() {
    if (opened) return;
    opened = true;

    // 1 — fade the button out
    cta.classList.add("is-hidden");
    $("#welcomeHint")?.classList.remove("is-shown");

    // 2 — envelope bounce
    envelope.classList.add("is-bounce");

    // start music on this trusted gesture
    if ((CONFIG.music || {}).startMuted !== true) playMusic();

    // 3 — flap opens + letter peeks (after the bounce)
    setTimeout(() => {
      envelope.classList.remove("is-bounce");
      envelope.classList.add("is-open");
    }, 520);

    // 4 — blur the welcome & slide the full letter up
    setTimeout(() => {
      document.body.dataset.phase = "opened";
      letterStage.classList.add("is-active");
      letterStage.setAttribute("aria-hidden", "false");
      $("#letter")?.focus?.();
    }, 1180);
  }

  function continueJourney() {
    // close the letter overlay smoothly
    letterStage.classList.add("is-closing");

    // unlock scrolling & reveal the journey
    document.body.classList.remove("is-locked");
    journey.classList.add("is-visible");
    journey.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      letterStage.classList.remove("is-active", "is-closing");
      letterStage.setAttribute("aria-hidden", "true");
      // smooth-scroll to the first chapter
      $("#gallery")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      initReveals(); // observe the now-visible sections
    }, 620);
  }

  /* ==========================================================
     8. WIRING & ACCESSIBILITY
     ========================================================== */
  function wireEvents() {
    openBtn.addEventListener("click", openLetter);
    envelope.addEventListener("click", openLetter);

    // keyboard: envelope acts like a button
    envelope.setAttribute("role", "button");
    envelope.setAttribute("tabindex", "0");
    envelope.setAttribute("aria-label", "Open the letter");
    envelope.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLetter();
      }
    });

    $("#continueBtn").addEventListener("click", continueJourney);

    // Escape from the letter continues the journey
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && letterStage.classList.contains("is-active")) {
        continueJourney();
      }
    });

    // reveal the "tap the envelope" hint shortly after load
    setTimeout(() => {
      if (!opened) $("#welcomeHint")?.classList.add("is-shown");
    }, 3200);
  }

  /* ==========================================================
     9. BOOT
     ========================================================== */
  function boot() {
    applyTheme();
    buildContent();
    wireEvents();
    initParticles();
    initParallax();
    initMusic();

    // trigger the on-load hero reveal on the next frame
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.body.classList.add("is-ready"))
    );

    // reveal welcome eyebrow / subtitle / cta
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
