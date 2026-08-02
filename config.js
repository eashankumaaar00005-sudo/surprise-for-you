/* ============================================================
   A SECRET JOURNEY — CONFIGURATION
   ------------------------------------------------------------
   This is the ONLY file you need to edit to personalise the
   experience. Change the name, the letter, add your photos and
   your song, and everything updates automatically.
   ============================================================ */

window.CONFIG = {
  /* ---------- The person this gift is for ---------- */
  recipient: "Priya",
  from: "", // optional — leave "" to keep the sender anonymous

  /* ---------- Welcome screen wording ---------- */
  welcome: {
    eyebrow: "A little surprise, made only for you",
    title: "A Secret\nJourney",
    subtitle:
      "Some things are too precious for a text message. So I made you something instead.",
    button: "Open My Letter",
  },

  /* ---------- The letter ----------
     Use single quotes or backticks. Line breaks are respected. */
  letter: {
    heading: "Dear Priya,",
    // Each string below becomes its own paragraph.
    body: [
      "If you are reading this, then it worked — and right now you are exactly where I hoped you'd be: smiling, a little curious, maybe rolling your eyes at how dramatic I'm being. Good. Stay right there.",
      "I wanted to make something that lasts a little longer than a message that gets buried in a chat. Something you can come back to on the loud days and the quiet ones. Because you deserve to be reminded — clearly, and often — of how much you mean to me.",
      "You are the friend who shows up. The one who remembers the small things, who laughs at my worst jokes, who has seen me at my messiest and decided to stay anyway. Do you know how rare that is? I do. I never take it for granted.",
      "So consider this my way of pressing pause on the everyday rush to simply say: thank you. For the years, the 2 a.m. talks, the inside jokes only we understand, and every ordinary moment you quietly made extraordinary.",
      "Scroll on. There's a little more of you waiting ahead.",
    ],
    signOff: "Always in your corner,",
    signature: "— Your Best Friend",
  },

  /* ---------- Photo gallery ----------
     Drop your images inside  assets/photos/  and list them here.
     If a photo is missing, an elegant placeholder is shown instead,
     so the gallery always looks complete. */
  gallery: {
    intro: "A few moments I never want us to forget.",
    photos: [
      { src: "assets/photos/1.jpg", caption: "Where it all began." },
      { src: "assets/photos/2.jpg", caption: "That day we laughed until it hurt." },
      { src: "assets/photos/3.jpg", caption: "The little adventures." },
      { src: "assets/photos/4.jpg", caption: "Golden hour, golden company." },
      { src: "assets/photos/5.jpg", caption: "Us, exactly as we are." },
      { src: "assets/photos/6.jpg", caption: "And so much more to come." },
    ],
  },

  /* ---------- Final message ---------- */
  finale: {
    eyebrow: "One last thing",
    title: "Here's to you, Priya.",
    message:
      "To the friendship that feels like home. May this year bring you everything you quietly wish for — and may I always get a front-row seat to your happiness.",
    signature: "With all my love.",
  },

  /* ---------- Background music ----------
     Put your song in  assets/music/  and set the path below.
     e.g. "assets/music/song.mp3". Leave "" to hide the player. */
  music: {
    src: "assets/music/song.mp3",
    startMuted: false, // browsers may still require a tap first
  },

  /* ---------- Theme (rose-gold luxury) ----------
     Advanced: tweak the accent palette here. */
  theme: {
    accent: "#e6b99a",       // rose gold
    accentSoft: "#f3d7c3",   // champagne
    accentDeep: "#c98b6b",   // deep rose
    ink: "#f6ece6",          // primary text
    bg: "#0e0b0c",           // near-black warm base
  },
};
