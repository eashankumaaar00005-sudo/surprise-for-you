/*==============================================================
A Secret Journey
Premium Interactive Experience

script.js
Version 2.0
Part 1/4

Architecture:
- DOM Utilities
- Config System
- Content Renderer
- State Manager
==============================================================*/

"use strict";


/*==============================================================
DOM UTILITIES
==============================================================*/

const $ = (selector, scope = document) =>
    scope.querySelector(selector);


const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];


/*==============================================================
CONFIG
==============================================================*/

const CONFIG = window.APP_CONFIG || {

    particles: 26,

    music: {
        volume: 0.45
    }

};


/*==============================================================
APP SETTINGS
==============================================================*/

const SETTINGS = {

    particles:
        CONFIG.particles ?? 26,

    musicVolume:
        CONFIG.music?.volume ?? 0.45,

    galleryDelay:
        CONFIG.galleryDelay ?? 180

};



/*==============================================================
STATE MANAGER
==============================================================*/


const STATE = {


    currentScene:
        "welcome",


    started:
        false,


    envelopeOpened:
        false,


    letterOpened:
        false,


    musicPlaying:
        false


};



/*==============================================================
DOM ELEMENT CACHE
==============================================================*/


const DOM = {


    app:
        $("#app"),


    welcome:
        $("#welcome"),


    welcomeContent:
        $("#welcomeContent"),


    envelopeScene:
        $("#envelopeScene"),


    envelope:
        $("#envelope"),


    envelopeInstruction:
        $("#envelopeInstruction"),


    letterScene:
        $("#letterScene"),


    letterPaper:
        $("#letterPaper"),


    letterContent:
        $("#letterContent"),


    gallery:
        $("#gallery"),


    galleryHeader:
        $("#galleryHeader"),


    galleryList:
        $("#galleryList"),


    ending:
        $("#ending"),


    endingContent:
        $("#endingContent"),


    blurOverlay:
        $("#blurOverlay"),


    particles:
        $("#particles"),


    musicButton:
        $("#musicButton"),


    music:
        $("#bgMusic"),


    progress:
        $("#progressBar")

};



/*==============================================================
HELPER FUNCTIONS
==============================================================*/


function wait(time){

    return new Promise(resolve => {

        setTimeout(resolve,time);

    });

}



function show(element){

    if(!element) return;

    element.classList.remove("hidden");

}



function hide(element){

    if(!element) return;

    element.classList.add("hidden");

}



function scrollTo(element){

    if(!element) return;


    element.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}



/*==============================================================
CONTENT RENDERER ENGINE
==============================================================*/


const Renderer = {


    renderWelcome(){


        if(!DOM.welcomeContent) return;


        const data = CONFIG.welcome;


        DOM.welcomeContent.innerHTML = `


        <div class="tiny-label">

            ${data.label}

        </div>



        <h1 class="hero-title">

            ${data.title}

        </h1>



        <p class="hero-subtitle">

            ${data.subtitle}

        </p>



        <button

        id="startJourney"

        class="primary-btn">


            ${data.button}


        </button>


        `;


    },



    renderLetter(){


        if(!DOM.letterContent) return;


        const data = CONFIG.letter;


        const paragraphs = data.paragraphs

        .map(text =>

            `<p>${text}</p>`

        )

        .join("");



        DOM.letterContent.innerHTML = `


        <div class="letter-date">

        ${data.date}

        </div>



        <h2>

        ${data.greeting}

        </h2>



        ${paragraphs}



        <div class="signature">

        ${data.signature}

        </div>


        `;


    },


    renderEnvelope(){


        if(!DOM.envelopeInstruction)
            return;


        DOM.envelopeInstruction.textContent =
            CONFIG.envelope.instruction;


    },



    renderGallery(){


        if(!DOM.galleryList)
            return;



        const data =
            CONFIG.gallery;



        DOM.galleryHeader.innerHTML = `


        <div class="tiny-label">

        ${data.title}

        </div>


        <h2>

        ${data.heading}

        </h2>


        `;



        DOM.galleryList.innerHTML =

        data.items.map((item,index)=>{


            return `


            <figure

            class="photo-card"

            data-index="${index}">


            <img

            src="${item.image}"

            loading="lazy"

            alt="${item.alt}">


            <figcaption>

            ${item.caption}

            </figcaption>


            </figure>


            `;


        }).join("");



    },



    renderEnding(){


        if(!DOM.endingContent)
            return;



        const data =
            CONFIG.ending;



        DOM.endingContent.innerHTML = `


        <div class="tiny-label">

        ${data.label}

        </div>



        <h2>

        ${data.title}

        </h2>



        ${
            data.message
            .map(text=>`<p>${text}</p>`)
            .join("")
        }



        <h3>

        ${data.emoji}

        </h3>


        `;


    },



    renderAll(){


        this.renderWelcome();

        this.renderEnvelope();

        this.renderLetter();

        this.renderGallery();

        this.renderEnding();


    }


};
/*==============================================================
SCENE CONTROLLER
==============================================================*/


const SceneController = {


    open(scene){

        show(scene);

    },


    close(scene){

        hide(scene);

    },


    change(from,to){


        hide(from);


        show(to);


        scrollTo(to);


    }


};



/*==============================================================
BUTTON EVENTS
==============================================================*/


function bindEvents(){


    const startButton =
        $("#startJourney");



    if(startButton){


        startButton.addEventListener(

            "click",

            startJourney,

            {
                passive:true
            }

        );


    }



    if(DOM.envelope){


        DOM.envelope.addEventListener(

            "click",

            openEnvelope,

            {
                passive:true
            }

        );


    }



    if(DOM.musicButton){


        DOM.musicButton.addEventListener(

            "click",

            toggleMusic,

            {
                passive:true
            }

        );


    }


}





/*==============================================================
WELCOME TRANSITION
==============================================================*/


async function startJourney(){


    if(STATE.started)
        return;



    STATE.started = true;



    const button =
        $("#startJourney");



    if(button){


        button.style.opacity="0";

        button.style.pointerEvents="none";


    }



    await wait(350);



    SceneController.change(

        DOM.welcome,

        DOM.envelopeScene

    );



    STATE.currentScene =
        "envelope";



}







/*==============================================================
ENVELOPE EXPERIENCE
==============================================================*/


async function openEnvelope(){


    if(STATE.envelopeOpened)
        return;



    STATE.envelopeOpened=true;



    /*
    Soft bounce
    */


    DOM.envelope.classList.add(
        "bounce"
    );



    await wait(650);



    DOM.envelope.classList.remove(
        "bounce"
    );



    /*
    Background blur
    */


    document.body.classList.add(
        "blur-background"
    );


    DOM.blurOverlay.classList.add(
        "active"
    );



    await wait(180);



    /*
    Open flap
    */


    DOM.envelope.classList.add(
        "open"
    );



    await wait(850);



    revealLetter();


}






/*==============================================================
LETTER REVEAL
==============================================================*/


async function revealLetter(){


    STATE.letterOpened=true;



    show(
        DOM.letterScene
    );



    await wait(120);



    scrollTo(
        DOM.letterScene
    );



    await wait(500);



    DOM.letterPaper.classList.add(
        "revealed"
    );



    document.body.classList.add(
        "letter-open"
    );



    await wait(500);



    DOM.blurOverlay.classList.remove(
        "active"
    );



    document.body.classList.remove(
        "blur-background"
    );



    /*
    Start music after user interaction
    */


    if(!STATE.musicPlaying){

        playMusic();

    }



    await wait(1200);



    show(
        DOM.gallery
    );



    STATE.currentScene =
        "gallery";


}






/*==============================================================
KEYBOARD ACCESSIBILITY
==============================================================*/


document.addEventListener(

"keydown",

(event)=>{


    if(event.key==="Enter"){



        const active =
            document.activeElement;



        if(
            active.id==="startJourney"
        ){

            startJourney();

        }



        if(
            active===DOM.envelope
        ){

            openEnvelope();

        }



    }



    if(event.key.toLowerCase()==="m"){

        toggleMusic();

    }



});



/*==============================================================
SCROLL PROGRESS
==============================================================*/


function updateProgress(){


    if(!DOM.progress)
        return;



    const height =

        document.documentElement.scrollHeight -

        window.innerHeight;



    const progress =

        height <= 0

        ? 0

        :

        (window.scrollY / height) * 100;



    DOM.progress.style.width =

        `${progress}%`;



}



window.addEventListener(

    "scroll",

    updateProgress,

    {
        passive:true
    }

);
/*==============================================================
PARTICLE ENGINE
==============================================================*/


function random(min,max){

    return Math.random() * (max-min) + min;

}



function createParticle(){


    if(!DOM.particles)
        return;



    const particle =
        document.createElement("span");



    particle.className =
        "particle";



    const size =
        random(2,6);



    const duration =
        random(18,36);



    const delay =
        random(-20,0);



    const position =
        random(0,100);



    particle.style.width =
        `${size}px`;



    particle.style.height =
        `${size}px`;



    particle.style.left =
        `${position}%`;



    particle.style.bottom =
        "-20px";



    particle.style.animationDuration =
        `${duration}s`;



    particle.style.animationDelay =
        `${delay}s`;



    particle.style.opacity =
        random(.08,.35);



    DOM.particles.appendChild(
        particle
    );


}



function createParticles(){


    if(!DOM.particles)
        return;



    DOM.particles.innerHTML="";



    for(
        let i=0;
        i<SETTINGS.particles;
        i++
    ){

        createParticle();

    }


}





/*==============================================================
MUSIC CONTROLLER
==============================================================*/


function updateMusicButton(){


    if(!DOM.musicButton)
        return;



    DOM.musicButton.classList.toggle(

        "playing",

        STATE.musicPlaying

    );


}



async function playMusic(){


    if(!DOM.music)
        return;



    try{


        DOM.music.volume =
            SETTINGS.musicVolume;



        await DOM.music.play();



        STATE.musicPlaying=true;



        updateMusicButton();


    }


    catch(error){


        console.warn(
            "Music waiting for interaction"
        );


    }


}





function pauseMusic(){


    if(!DOM.music)
        return;



    DOM.music.pause();



    STATE.musicPlaying=false;



    updateMusicButton();


}




function toggleMusic(){


    if(
        STATE.musicPlaying
    ){

        pauseMusic();

    }

    else{

        playMusic();

    }


}






/*==============================================================
GALLERY CONTROLLER
==============================================================*/


let galleryCards = [];



function prepareGallery(){


    galleryCards =
        $$(".photo-card");



}





async function revealGallery(){


    for(
        const card of galleryCards
    ){


        card.classList.add(
            "visible"
        );



        await wait(
            SETTINGS.galleryDelay
        );


    }


}






/*==============================================================
INTERSECTION OBSERVER
==============================================================*/


const observer =

new IntersectionObserver(

(entries)=>{


    entries.forEach(

        entry=>{


            if(
                !entry.isIntersecting
            )
            return;



            const element =
                entry.target;



            element.classList.add(
                "show"
            );



            observer.unobserve(
                element
            );


        }


    );


},

{

    threshold:0.15,

    rootMargin:
    "0px 0px -10% 0px"

}

);






function observeElements(){


    const elements =

    $$(
        ".fade-up, .photo-card"
    );



    elements.forEach(

        element=>{

            observer.observe(
                element
            );

        }

    );


}






/*==============================================================
VISIBILITY CONTROL
==============================================================*/


document.addEventListener(

"visibilitychange",

()=>{


    if(
        document.hidden
        &&
        STATE.musicPlaying
    ){

        DOM.music.pause();


    }



    else if(

        !document.hidden
        &&
        STATE.musicPlaying

    ){


        DOM.music.play()
        .catch(()=>{});


    }



}

);






/*==============================================================
RESIZE OPTIMIZATION
==============================================================*/


let resizeTimer;



window.addEventListener(

"resize",

()=>{


    clearTimeout(
        resizeTimer
    );



    resizeTimer = setTimeout(

        ()=>{

            updateProgress();

        },

        150

    );


},

{
    passive:true
}

);
/*==============================================================
ACCESSIBILITY INITIALIZATION
==============================================================*/


function setupAccessibility(){


    if(DOM.envelope){


        DOM.envelope.tabIndex = 0;


        DOM.envelope.setAttribute(
            "role",
            "button"
        );


        DOM.envelope.setAttribute(
            "aria-label",
            "Open envelope"
        );


    }


}






/*==============================================================
SCREEN INITIALIZATION
==============================================================*/


function initializeScreens(){


    hide(
        DOM.envelopeScene
    );


    hide(
        DOM.letterScene
    );


    hide(
        DOM.gallery
    );


    hide(
        DOM.ending
    );


}





/*==============================================================
MUSIC INITIALIZATION
==============================================================*/


function initializeMusic(){


    if(!DOM.music)
        return;



    DOM.music.volume =
        SETTINGS.musicVolume;



    updateMusicButton();


}






/*==============================================================
RENDER COMPLETE DOM UPDATE
==============================================================*/


function refreshDynamicElements(){


    /*
    Renderer creates elements
    so we cache them after rendering
    */


    prepareGallery();



}






/*==============================================================
APP START
==============================================================*/


function initializeApp(){



    /*
    1. Generate content
    */


    Renderer.renderAll();




    /*
    2. Refresh generated elements
    */


    refreshDynamicElements();





    /*
    3. Prepare UI
    */


    initializeScreens();



    initializeMusic();



    setupAccessibility();





    /*
    4. Background
    */


    createParticles();





    /*
    5. Events
    */


    bindEvents();





    /*
    6. Observer
    */


    observeElements();





    /*
    7. Progress
    */


    updateProgress();





    console.log(
        "A Secret Journey initialized"
    );


}






/*==============================================================
DOM READY
==============================================================*/


document.addEventListener(

"DOMContentLoaded",

initializeApp

);
