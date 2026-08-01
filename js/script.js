/*==============================================================
A Secret Journey
Premium Interactive Experience
script.js
Part 3.1
==============================================================*/

"use strict";

/*==============================================================
DOM CACHE
==============================================================*/

const $ = (selector, scope = document) => scope.querySelector(selector);

const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];

/*==============================================================
ELEMENTS
==============================================================*/

const app = $("#app");

const startButton = $("#startJourney");

const welcomeScreen = $("#welcome");

const envelopeScreen = $("#envelopeScene");

const letterScreen = $("#letterScene");

const galleryScreen = $("#gallery");

const endingScreen = $("#ending");

const envelope = $("#envelope");

const letterPaper = $("#letterPaper");

const blurOverlay = $("#blurOverlay");

const progressBar = $("#progressBar");

const particlesContainer = $("#particles");

const musicButton = $("#musicButton");

const bgMusic = $("#bgMusic");

const photoCards = $$(".photo-card");

/*==============================================================
CONFIG
==============================================================*/

const SETTINGS = window.APP_CONFIG || {

    particles: 26,

    musicVolume: .45,

    galleryDelay: 180

};

/*==============================================================
STATE
==============================================================*/

const state = {

    started:false,

    envelopeOpened:false,

    musicPlaying:false

};

/*==============================================================
HELPERS
==============================================================*/

function wait(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}



function show(el){

    el.classList.remove("hidden");

}



function hide(el){

    el.classList.add("hidden");

}



function easeScroll(target){

    target.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}



/*==============================================================
PARTICLE SYSTEM
==============================================================*/

function random(min,max){

    return Math.random()*(max-min)+min;

}



function createParticle(){

    const particle=document.createElement("span");

    particle.className="particle";



    const size=random(2,6);

    const duration=random(16,34);

    const delay=random(-25,0);

    const left=random(0,100);



    particle.style.width=`${size}px`;

    particle.style.height=`${size}px`;

    particle.style.left=`${left}%`;

    particle.style.bottom="-20px";

    particle.style.animationDuration=`${duration}s`;

    particle.style.animationDelay=`${delay}s`;

    particle.style.opacity=random(.08,.35);



    particlesContainer.appendChild(particle);

}



function buildParticles(){

    particlesContainer.innerHTML="";



    for(

        let i=0;

        i<SETTINGS.particles;

        i++

    ){

        createParticle();

    }

}



/*==============================================================
BACKGROUND MUSIC
==============================================================*/

function updateMusicUI(){

    musicButton.classList.toggle(

        "playing",

        state.musicPlaying

    );

}



async function playMusic(){

    try{

        bgMusic.volume=SETTINGS.musicVolume;

        await bgMusic.play();

        state.musicPlaying=true;

        updateMusicUI();

    }

    catch(err){

        console.warn(

            "Autoplay prevented.",

            err

        );

    }

}



function pauseMusic(){

    bgMusic.pause();

    state.musicPlaying=false;

    updateMusicUI();

}



function toggleMusic(){

    if(state.musicPlaying){

        pauseMusic();

    }else{

        playMusic();

    }

}



musicButton.addEventListener(

    "click",

    toggleMusic,

    {passive:true}

);

/*==============================================================
SCROLL PROGRESS
==============================================================*/

function updateProgress(){

    const scrollTop=

        window.scrollY;

    const scrollHeight=

        document.documentElement.scrollHeight-

        window.innerHeight;

    const progress=

        scrollHeight<=0

        ?0

        :(scrollTop/scrollHeight)*100;

    progressBar.style.width=

        progress+"%";

}



window.addEventListener(

    "scroll",

    updateProgress,

    {

        passive:true

    }

);

/*==============================================================
INTRO TRANSITION
==============================================================*/

async function startJourney(){

    if(state.started){

        return;

    }

    state.started=true;

    startButton.style.opacity="0";

    startButton.style.pointerEvents="none";

    await wait(350);

    welcomeScreen.classList.add("hidden");

    envelopeScreen.classList.remove("hidden");

    easeScroll(envelopeScreen);

}
/*==============================================================
ENVELOPE INTERACTION
==============================================================*/

startButton.addEventListener(
    "click",
    startJourney,
    { passive: true }
);

async function openEnvelope() {

    if (state.envelopeOpened) {
        return;
    }

    state.envelopeOpened = true;

    /* Bounce */

    envelope.classList.add("bounce");

    await wait(650);

    envelope.classList.remove("bounce");

    /* Blur Background */

    document.body.classList.add("blur-background");

    blurOverlay.classList.add("active");

    await wait(180);

    /* Open Flap */

    envelope.classList.add("open");

    await wait(850);

    /* Reveal Letter */

    revealLetter();

}

envelope.addEventListener(
    "click",
    openEnvelope,
    { passive: true }
);

/*==============================================================
LETTER REVEAL
==============================================================*/

async function revealLetter() {

    letterScreen.classList.remove("hidden");

    await wait(120);

    easeScroll(letterScreen);

    await wait(500);

    letterPaper.classList.add("revealed");

    document.body.classList.add("letter-open");

    /* Remove Blur */

    await wait(500);

    blurOverlay.classList.remove("active");

    document.body.classList.remove("blur-background");

    /* Auto play music after interaction */

    if (!state.musicPlaying) {
        playMusic();
    }

    /* Continue toward gallery */

    await wait(1200);

    galleryScreen.classList.remove("hidden");

}

/*==============================================================
LETTER ANIMATION HELPERS
==============================================================*/

function revealElement(element) {

    if (!element) return;

    element.classList.add("show");

}

function hideElement(element) {

    if (!element) return;

    element.classList.remove("show");

}

/*==============================================================
PHOTO CARD REVEAL
==============================================================*/

async function revealGallerySequential() {

    for (const card of photoCards) {

        card.classList.add("visible");

        await wait(SETTINGS.galleryDelay);

    }

}/*==============================================================
INTERSECTION OBSERVER
==============================================================*/

const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.18
};

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const target = entry.target;

        if (target.classList.contains("photo-card")) {
            target.classList.add("visible");
        }

        if (target.classList.contains("fade-up")) {
            target.classList.add("show");
        }

        revealObserver.unobserve(target);

    });

}, observerOptions);

/*==============================================================
REGISTER OBSERVERS
==============================================================*/

function registerObservers() {

    photoCards.forEach((card) => {
        revealObserver.observe(card);
    });

    $$(".fade-up").forEach((item) => {
        revealObserver.observe(item);
    });

}

/*==============================================================
GALLERY FLOW
==============================================================*/

async function initializeGallery() {

    await wait(600);

    revealGallerySequential();

}

/*==============================================================
ENDING SECTION
==============================================================*/

function watchEnding() {

    if (!endingScreen) return;

    revealObserver.observe(endingScreen);

}

/*==============================================================
KEYBOARD SUPPORT
==============================================================*/

document.addEventListener("keydown", (event) => {

    switch (event.key) {

        case "Enter":

        case " ":

            if (
                document.activeElement === startButton &&
                !state.started
            ) {

                event.preventDefault();
                startJourney();

            }

            if (
                document.activeElement === envelope &&
                !state.envelopeOpened
            ) {

                event.preventDefault();
                openEnvelope();

            }

            break;

        case "m":

        case "M":

            toggleMusic();
            break;

        default:
            break;
    }

});

/*==============================================================
RESIZE HANDLER
==============================================================*/

let resizeTimer;

window.addEventListener(

    "resize",

    () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            updateProgress();

        }, 120);

    },

    { passive: true }

);

/*==============================================================
VISIBILITY API
==============================================================*/

document.addEventListener("visibilitychange", () => {

    if (document.hidden && state.musicPlaying) {

        bgMusic.pause();

    }

    if (!document.hidden && state.musicPlaying) {

        bgMusic.play().catch(() => {});

    }

});

/*==============================================================
INITIALIZATION
==============================================================*/

function initializeScreens() {

    envelopeScreen.classList.add("hidden");
    letterScreen.classList.add("hidden");
    galleryScreen.classList.add("hidden");

}

function initializeMusic() {

    bgMusic.volume = SETTINGS.musicVolume;

    updateMusicUI();

}

function initializeEnvelopeAccessibility() {

    envelope.tabIndex = 0;

    envelope.setAttribute(
        "role",
        "button"
    );

    envelope.setAttribute(
        "aria-label",
        "Open Envelope"
    );

}

function initialize() {

    buildParticles();

    initializeScreens();

    initializeMusic();

    initializeEnvelopeAccessibility();

    registerObservers();

    watchEnding();

    initializeGallery();

    updateProgress();

}

document.addEventListener(

    "DOMContentLoaded",

    initialize

);

/*==============================================================
END OF FILE
==============================================================*/
