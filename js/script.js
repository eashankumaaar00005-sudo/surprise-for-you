/*==================================================
    SURPRISE JOURNEY V3
    SCRIPT.JS
==================================================*/


document.addEventListener("DOMContentLoaded", () => {


    /*==================================================
        GSAP SETUP
    ==================================================*/

    gsap.registerPlugin(ScrollTrigger);



    /*==================================================
        CONFIG APPLY
    ==================================================*/

    if (typeof CONFIG !== "undefined") {


        document.title = CONFIG.title;


        const heroTitle =
            document.querySelector(".hero-card h1");


        if (heroTitle) {

            heroTitle.innerHTML =
                CONFIG.title.replace(" ", "<br>");

        }

    }




    /*==================================================
        FLOATING STARS
    ==================================================*/


    const starsContainer =
        document.getElementById("stars");


    function createStars() {


        if (!starsContainer) return;


        for (let i = 0; i < 120; i++) {


            const star =
                document.createElement("span");


            star.className = "star";


            star.style.left =
                Math.random() * 100 + "%";


            star.style.animationDuration =
                (5 + Math.random() * 10) + "s";


            star.style.animationDelay =
                Math.random() * 10 + "s";


            star.style.opacity =
                Math.random();


            starsContainer.appendChild(star);

        }

    }


    createStars();





    /*==================================================
        MOUSE GLOW
    ==================================================*/


    const mouseGlow =
        document.getElementById("mouseGlow");


    if (mouseGlow) {


        window.addEventListener(
            "mousemove",
            (e) => {


                gsap.to(
                    mouseGlow,
                    {

                        x: e.clientX,

                        y: e.clientY,

                        duration: 0.8,

                        ease: "power3.out"

                    }
                );


            }
        );

    }





    /*==================================================
        LOADER
    ==================================================*/


    const loader =
        document.getElementById("loader");


    const progress =
        document.getElementById("loaderProgress");



    function removeLoader() {


        if (!loader) {

            startIntro();

            return;

        }


        gsap.to(
            loader,
            {

                opacity: 0,

                duration: 1,

                onComplete: () => {

                    loader.remove();

                    startIntro();

                }

            }
        );


    }



    if (progress) {


        let value = 0;


        const loaderTimer =
            setInterval(() => {


                value += Math.random() * 8;


                if (value >= 100) {


                    value = 100;


                    clearInterval(loaderTimer);


                    progress.style.width =
                        "100%";


                    setTimeout(
                        removeLoader,
                        700
                    );


                }


                progress.style.width =
                    value + "%";


            }, 150);


    }
    else {


        startIntro();

    }





    /*==================================================
        HERO INTRO
    ==================================================*/


    function startIntro() {


        const timeline =
            gsap.timeline();



        timeline
            .from(
                ".hero-card",
                {

                    opacity: 0,

                    y: 80,

                    duration: 1.4,

                    ease: "power4.out"

                }
            )


            .from(
                ".badge",
                {

                    opacity: 0,

                    scale: .5,

                    duration: .8

                },
                "-=.8"
            )


            .from(
                ".envelope",
                {

                    opacity: 0,

                    scale: .5,

                    rotationY: 180,

                    duration: 1.5,

                    ease: "back.out"

                },
                "-=.5"
            )


            .from(
                "#startBtn",
                {

                    opacity: 0,

                    y: 30,

                    duration: 1

                },
                "-=.5"
            );


    }





    /*==================================================
        ENVELOPE OPEN
    ==================================================*/


    const envelope =
        document.getElementById("envelope");


    const startBtn =
        document.getElementById("startBtn");



    if (startBtn && envelope) {


        startBtn.addEventListener(
            "click",
            () => {


                envelope.classList.add("open");


                gsap.to(
                    startBtn,
                    {

                        opacity: 0,

                        scale: 0,

                        duration: .5

                    }
                );



                setTimeout(() => {


                    document
                        .querySelector(".letter")
                        ?.scrollIntoView(
                            {
                                behavior: "smooth"
                            }
                        );


                    typeLetter();


                }, 1200);



            }
        );


    }





    /*==================================================
        TYPEWRITER
    ==================================================*/


    function typeWriter(
        element,
        text,
        speed = 45
    ) {


        if (!element) return;


        element.innerHTML = "";


        let index = 0;



        function write() {


            if (index < text.length) {


                element.innerHTML +=
                    text.charAt(index);


                index++;


                setTimeout(
                    write,
                    speed
                );


            }


        }


        write();


    }




    let letterStarted = false;



    function typeLetter() {


        if (letterStarted) return;


        if (typeof CONFIG === "undefined")
            return;


        letterStarted = true;


        typeWriter(

            document.getElementById("typewriter"),

            CONFIG.letter

        );


    }





    /*==================================================
        BUTTON NAVIGATION
    ==================================================*/


    document
        .getElementById("continueBtn")
        ?.addEventListener(
            "click",
            () => {


                document
                    .querySelector(".journey")
                    ?.scrollIntoView(
                        {
                            behavior:"smooth"
                        }
                    );


            }
        );




    document
        .getElementById("journeyBtn")
        ?.addEventListener(
            "click",
            () => {


                document
                    .querySelector(".gallery")
                    ?.scrollIntoView(
                        {
                            behavior:"smooth"
                        }
                    );


            }
        );






    /*==================================================
        GALLERY
    ==================================================*/


    const gallery =
        document.getElementById("galleryGrid");



    if (
        gallery &&
        typeof CONFIG !== "undefined" &&
        CONFIG.photos
    ) {


        CONFIG.photos.forEach(
            (photo, index) => {


                const card =
                    document.createElement("div");


                card.className =
                    "photo-card reveal";



                card.innerHTML = `

                    <img 
                    src="${photo}" 
                    alt="Memory ${index+1}"
                    loading="lazy">

                `;



                gallery.appendChild(card);


            }
        );


    }







    /*==================================================
        SCROLL ANIMATIONS
    ==================================================*/


    gsap.utils.toArray(".reveal")
        .forEach(item => {


            gsap.to(
                item,
                {

                    opacity:1,

                    y:0,

                    duration:1,


                    scrollTrigger:{

                        trigger:item,

                        start:"top 85%"

                    }

                }
            );


        });





    gsap.utils.toArray(".section")
        .forEach(section => {


            gsap.from(
                section,
                {

                    opacity:0,

                    y:40,

                    duration:1,


                    scrollTrigger:{

                        trigger:section,

                        start:"top 90%"

                    }

                }
            );


        });

    /*==================================================
        FINAL MESSAGE
    ==================================================*/

    let finalStarted = false;
    document
        .getElementById("finishBtn")
        ?.addEventListener(
            "click",
            () => {
                if(finalStarted)
                    return;
                finalStarted = true;
                document
                    .querySelector(".final")
                    ?.scrollIntoView(
                        {
                            behavior:"smooth"
                        }
                    );
                setTimeout(
                    () => {


                        if(typeof CONFIG !== "undefined"){


                            typeWriter(

                                document.getElementById(
                                    "finalText"
                                ),
                                CONFIG.finalMessage,
                                60
                            );
                        }
                    },
                    900
                );
            }
        );

    /*==================================================
        REPLAY
    ==================================================*/

    document
        .getElementById("replayBtn")
        ?.addEventListener(
            "click",
            () => {
                window.scrollTo(
                    {
                        top:0,
                        behavior:"smooth"
                    }
                );
                setTimeout(
                    () => {
                        location.reload();
                    },
                    1200
                );
            }
        );
});
