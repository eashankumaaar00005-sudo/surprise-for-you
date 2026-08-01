/* ==========================================================================
   A SECRET JOURNEY — CONFIG
   --------------------------------------------------------------------------
   Everything you are likely to want to change lives in this one file:
   names, the letter, the photos, the final message and the music.
   Nothing in index.html, style.css or script.js needs to be touched.
   ========================================================================== */

const CONFIG = {

  /* ---------------------------------------------------------------------
     WELCOME SCREEN
     -------------------------------------------------------------------- */
  welcome: {
    eyebrow: "A Secret Journey",
    heading: "For You",
    subtitle: "Something has been waiting for you to find it.",
    buttonLabel: "Open My Letter",
  },

  /* ---------------------------------------------------------------------
     ENVELOPE SCREEN
     -------------------------------------------------------------------- */
  envelope: {
    seal: "❤", // symbol shown on the wax seal
    hint: "Tap the envelope to open it",
    to: "To the one who matters most",
  },

  /* ---------------------------------------------------------------------
     LETTER
     Each entry in "paragraphs" becomes its own line in the letter.
     -------------------------------------------------------------------- */
  letter: {
    greeting: "My Dearest,",
    paragraphs: [
      "If you're reading this, it means I finally found a way to put into words what I've been carrying in my chest for a long time.",
      "Every ordinary day becomes something worth remembering when you're in it. I don't say that lightly — I say it because it's the quiet, plain truth.",
      "This little journey is my way of showing you a few of the moments that mean the most to me. Take your time with them.",
      "There's more waiting for you just ahead.",
    ],
    signature: "Always yours",
  },

  /* ---------------------------------------------------------------------
     PHOTO GALLERY
     Replace "src" with your own images inside assets/photos/
     Captions are optional — leave as an empty string to omit.
     -------------------------------------------------------------------- */
  gallery: {
    heading: "Moments We've Made",
    subtitle: "A few frames from our story so far.",
    photos: [
      { src: "assets/photos/photo-1.jpg", caption: "The day it all began." },
      { src: "assets/photos/photo-2.jpg", caption: "A moment I never wanted to end." },
      { src: "assets/photos/photo-3.jpg", caption: "You, laughing — my favorite sound." },
      { src: "assets/photos/photo-4.jpg", caption: "Somewhere, just the two of us." },
      { src: "assets/photos/photo-5.jpg", caption: "This is my favorite kind of quiet." },
    ],
  },

  /* ---------------------------------------------------------------------
     FINAL SCREEN
     -------------------------------------------------------------------- */
  final: {
    heading: "I Love You",
    message: "Thank you for being the softest, safest place I know. Here's to every ordinary day still ahead of us.",
    signature: "— Yours, always",
    replayLabel: "Read It Again",
  },

  /* ---------------------------------------------------------------------
     MUSIC
     Drop an mp3 into assets/music/ and update the path below.
     Leave "src" empty ("") to hide the music control entirely.
     -------------------------------------------------------------------- */
  music: {
    src: "assets/music/song.mp3",
    label: "Our Song",
  },

};
