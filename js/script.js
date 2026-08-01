/* ==========================================================================
   A SECRET JOURNEY — SCRIPT
   --------------------------------------------------------------------------
   Vanilla JS state machine driving five screens:
   welcome -> envelope -> letter -> gallery -> final
   Reads all copy/content from CONFIG (config.js) so nothing here needs
   to change when the content does.
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------
     0. SMALL HELPERS
     -------------------------------------------------------------- */

  /** Resolve a dotted path like "welcome.heading" against CONFIG. */
  function resolvePath(path) {
    return path.split(".").reduce((node, key) => (node && node[key] !== undefined ? node[key] : ""), CONFIG);
  }

  /** Fill every [data-fill] element in the document with its CONFIG value. */
  function fillContent() {
    document.querySelectorAll("[data-fill]").forEach((el) => {
      const value = resolvePath(el.getAttribute("data-fill"));
      if (value !== "" && value !== undefined) el.textContent = value;
    });
  }

  /* -----------------------------------------------------------------
     1. SCREEN STATE MACHINE
     -------------------------------------------------------------- */

  const screens = Array.from(document.querySelectorAll(".screen"));
  const screenByName = Object.fromEntries(screens.map((el) => [el.dataset.screen, el]));
  let currentScreen = "welcome";

  /**
   * Cross-fades from the current screen to `name`.
   * Both screens transition on the same class toggle, so the outgoing
   * screen fades/settles down while the incoming one rises/fades in —
   * a single simultaneous motion rather than two separate steps.
   */
  function goToScreen(name) {
    const next = screenByName[name];
    if (!next || name === currentScreen) return;

    screenByName[currentScreen]?.classList.remove("is-active");
    next.classList.add("is-active");
    currentScreen = name;

    onScreenEnter(name);
  }

  function onScreenEnter(name) {
    if (name === "gallery") observeGalleryCards();
    if (name === "final") revealMusicToggle();
  }

  /* -----------------------------------------------------------------
     2. WELCOME -> ENVELOPE
     -------------------------------------------------------------- */

  const openLetterBtn = document.getElementById("btn-open-letter");
  openLetterBtn?.addEventListener("click", () => goToScreen("envelope"));

  /* -----------------------------------------------------------------
     3. ENVELOPE OPENING SEQUENCE
     -------------------------------------------------------------- */

  const envelope = document.getElementById("envelope");
  const envelopeHint = document.getElementById("envelope-hint");
  let envelopeOpened = false;

  envelope?.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    envelope.classList.add("is-opening");
    if (envelopeHint) envelopeHint.style.opacity = "0";

    // Let the flap-open + letter-peek animation play out before
    // handing off to the full letter screen. Timing is halved when
    // the user prefers reduced motion.
    const holdTime = prefersReducedMotion ? 250 : 950;
    window.setTimeout(() => goToScreen("letter"), holdTime);
  });

  /* -----------------------------------------------------------------
     4. LETTER CONTENT + CONTINUE
     -------------------------------------------------------------- */

  function renderLetter() {
    const container = document.getElementById("letter-body");
    if (!container) return;
    container.innerHTML = "";
    (CONFIG.letter.paragraphs || []).forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      container.appendChild(p);
    });
  }

  document.getElementById("btn-to-gallery")?.addEventListener("click", () => goToScreen("gallery"));

  /* -----------------------------------------------------------------
     5. GALLERY: RENDER CARDS + SCROLL REVEAL
     -------------------------------------------------------------- */

  let galleryRendered = false;
  let galleryObserver = null;

  function renderGallery() {
    const track = document.getElementById("gallery-track");
    if (!track) return;
    track.innerHTML = "";

    (CONFIG.gallery.photos || []).forEach((photo, index) => {
      const card = document.createElement("article");
      card.className = "gallery-card";

      const frame = document.createElement("div");
      frame.className = "gallery-card__frame";

      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = photo.caption || `Photo ${index + 1}`;
      img.addEventListener("load", () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => frame.classList.add("has-error"));
      img.src = photo.src;

      const fallback = document.createElement("div");
      fallback.className = "gallery-card__fallback";
      fallback.textContent = "❤";
      fallback.setAttribute("aria-hidden", "true");

      frame.appendChild(img);
      frame.appendChild(fallback);
      card.appendChild(frame);

      if (photo.caption) {
        const caption = document.createElement("p");
        caption.className = "gallery-card__caption";
        caption.textContent = photo.caption;
        card.appendChild(caption);
      }

      track.appendChild(card);
    });

    galleryRendered = true;
  }

  function observeGalleryCards() {
    if (!galleryRendered) renderGallery();

    const scrollEl = document.getElementById("gallery-scroll");
    const cards = document.querySelectorAll(".gallery-card");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("in-view"));
      return;
    }

    if (galleryObserver) galleryObserver.disconnect();
    galleryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            galleryObserver.unobserve(entry.target);
          }
        });
      },
      { root: scrollEl, threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    cards.forEach((c) => galleryObserver.observe(c));
  }

  document.getElementById("btn-to-final")?.addEventListener("click", () => goToScreen("final"));

  /* -----------------------------------------------------------------
     6. FINAL SCREEN: REPLAY
     -------------------------------------------------------------- */

  document.getElementById("btn-replay")?.addEventListener("click", () => {
    // Reset the envelope so the journey can be experienced again.
    envelopeOpened = false;
    envelope?.classList.remove("is-opening");
    if (envelopeHint) envelopeHint.style.opacity = "";

    const galleryScroll = document.getElementById("gallery-scroll");
    if (galleryScroll) galleryScroll.scrollTo({ top: 0, behavior: "auto" });

    goToScreen("welcome");
  });

  /* -----------------------------------------------------------------
     7. MUSIC CONTROL
     -------------------------------------------------------------- */

  const musicToggle = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const audio = document.getElementById("bg-music");
  let musicShown = false;
  let isPlaying = false;

  function revealMusicToggle() {
    if (musicShown || !CONFIG.music?.src) return;
    musicShown = true;
    audio.src = CONFIG.music.src;
    musicToggle.hidden = false;
    // allow the browser to paint hidden=false before animating in
    requestAnimationFrame(() => musicToggle.classList.add("is-visible"));
  }

  musicToggle?.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        /* Autoplay/permission errors are silently ignored — the
           control simply stays in its paused state. */
      });
    }
  });

  audio?.addEventListener("play", () => {
    isPlaying = true;
    musicToggle.classList.add("is-playing");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Pause music");
    if (musicLabel) musicLabel.textContent = CONFIG.music.label || "Playing";
  });

  audio?.addEventListener("pause", () => {
    isPlaying = false;
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play music");
    if (musicLabel) musicLabel.textContent = "Play Music";
  });

  /* -----------------------------------------------------------------
     8. AMBIENT PARTICLE CANVAS
     Lightweight drifting dots. Skips the animation loop entirely
     when the user prefers reduced motion, and keeps particle count
     tied to viewport area so small phones stay light.
     -------------------------------------------------------------- */

  function setupParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height, particles, dpr;
    let rafId = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 26000);
      particles = Array.from({ length: Math.min(count, 46) }, () => makeParticle());
    }

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        vy: -(Math.random() * 0.12 + 0.03),
        vx: (Math.random() - 0.5) * 0.05,
        alpha: Math.random() * 0.4 + 0.15,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ecd9b6";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }

    resize();

    if (prefersReducedMotion) {
      draw(); // paint a single static frame, then stop
      cancelAnimationFrame(rafId);
      return;
    }

    draw();

    let resizeTimer;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          cancelAnimationFrame(rafId);
          resize();
          draw();
        }, 180);
      },
      { passive: true }
    );
  }

  /* -----------------------------------------------------------------
     9. INIT
     -------------------------------------------------------------- */

  function init() {
    fillContent();
    renderLetter();
    setupParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
