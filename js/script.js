/*==================================================
    SURPRISE JOURNEY V3
    FINAL SCRIPT.JS
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/*==================================================
    GSAP
==================================================*/

gsap.registerPlugin(ScrollTrigger);




/*==================================================
    INITIAL SCROLL LOCK
==================================================*/


let journeyUnlocked = false;


function preventScroll(e){

    if(!journeyUnlocked){

        e.preventDefault();

    }

}


window.addEventListener(
"wheel",
preventScroll,
{
    passive:false
});


window.addEventListener(
"touchmove",
preventScroll,
{
    passive:false
});


window.addEventListener(
"keydown",
(e)=>{


if(
!journeyUnlocked &&
[
"ArrowDown",
"ArrowUp",
"Space",
"PageDown",
"PageUp"
]
.includes(e.code)
){

e.preventDefault();

}


});




/*==================================================
    CONFIG APPLY
==================================================*/


if(typeof CONFIG !== "undefined"){


document.title =
CONFIG.title;


const title =
document.querySelector(
".hero-card h1"
);


if(title){

title.innerHTML =
CONFIG.title.replace(
" ",
"<br>"
);

}


}






/*==================================================
    FLOATING STARS
==================================================*/


const stars =
document.getElementById("stars");


function createStars(){


if(!stars) return;


for(let i=0;i<120;i++){


const star =
document.createElement("span");


star.className="star";


star.style.left =
Math.random()*100+"%";


star.style.animationDuration =
(5+Math.random()*10)+"s";


star.style.animationDelay =
Math.random()*10+"s";


stars.appendChild(star);


}


}


createStars();






/*==================================================
    MOUSE GLOW
==================================================*/


const mouseGlow =
document.getElementById(
"mouseGlow"
);


window.addEventListener(
"mousemove",
(e)=>{


if(mouseGlow){

gsap.to(
mouseGlow,
{

x:e.clientX,

y:e.clientY,

duration:.8,

ease:"power3.out"

}

);

}


});






/*==================================================
    GOLD PARTICLES
==================================================*/


function createParticle(x,y){


const p =
document.createElement("span");


p.className =
"gold-particle";


p.style.left =
x+"px";


p.style.top =
y+"px";


document.body.appendChild(p);



gsap.to(
p,
{

y:-80,

opacity:0,

scale:0,

duration:1,

onComplete(){

p.remove();

}

}

);


}



window.addEventListener(
"mousemove",
(e)=>{


if(Math.random()>.88){

createParticle(
e.clientX,
e.clientY
);

}


});







/*==================================================
    LOADER
==================================================*/


const loader =
document.getElementById(
"loader"
);


const progress =
document.getElementById(
"loaderProgress"
);



function startPage(){


if(loader){


gsap.to(
loader,
{

opacity:0,

duration:1,

onComplete:()=>{

loader.remove();

document.body.classList.add("locked");

startIntro();

}

}

);


}
else{


startIntro();


}


}




if(progress){


let value=0;


const timer =
setInterval(()=>{


value += Math.random()*10;


progress.style.width =
value+"%";


if(value>=100){


clearInterval(timer);


progress.style.width="100%";


setTimeout(
startPage,
700
);


}


},120);



}
else{


startPage();


}








/*==================================================
    HERO INTRO
==================================================*/


function startIntro(){


const tl =
gsap.timeline();



tl.from(
".hero-card",
{

opacity:0,

y:80,

duration:1.3,

ease:"power4.out"

}
)


.from(
".badge",
{

opacity:0,

scale:.5,

duration:.7

},
"-=.8"
)


.from(
".envelope",
{

opacity:0,

scale:.5,

rotationY:180,

duration:1.4,

ease:"back.out"

},
"-=.5"
)


.from(
"#startBtn",
{

opacity:0,

y:30,

duration:.8

},
"-=.5"
);



}








/*==================================================
    ENVELOPE OPEN
==================================================*/


const envelope =
document.getElementById(
"envelope"
);


const startBtn =
document.getElementById(
"startBtn"
);



if(startBtn && envelope){


startBtn.addEventListener(
"click",
()=>{


journeyUnlocked=true;
    document.body.classList.remove("locked");



window.removeEventListener(
"wheel",
preventScroll
);


window.removeEventListener(
"touchmove",
preventScroll
);




envelope.classList.add(
"open"
);



gsap.to(
startBtn,
{

opacity:0,

scale:0,

duration:.5

}

);



setTimeout(()=>{


document
.querySelector(".letter")
?.scrollIntoView(
{
behavior:"smooth"
}
);



typeLetter();


},1200);



});


}







/*==================================================
    TYPEWRITER
==================================================*/


function typeWriter(
element,
text,
speed=45
){


if(!element)return;


element.innerHTML="";


let i=0;



function write(){


if(i<text.length){


element.innerHTML +=
text.charAt(i);


i++;


setTimeout(
write,
speed
);


}


}



write();


}



let letterDone=false;



function typeLetter(){


if(letterDone)return;


if(typeof CONFIG==="undefined")
return;


letterDone=true;


typeWriter(
document.getElementById(
"typewriter"
),
CONFIG.letter
);


}








/*==================================================
    BUTTON NAVIGATION
==================================================*/


document
.getElementById(
"continueBtn"
)
?.addEventListener(
"click",
()=>{


document
.querySelector(".journey")
?.scrollIntoView(
{
behavior:"smooth"
}
);


});




document
.getElementById(
"journeyBtn"
)
?.addEventListener(
"click",
()=>{


document
.querySelector(".gallery")
?.scrollIntoView(
{
behavior:"smooth"
}
);


});








/*==================================================
    GALLERY CREATE
==================================================*/


const gallery =
document.getElementById(
"galleryGrid"
);



if(
gallery &&
typeof CONFIG!=="undefined"
){


CONFIG.photos.forEach(
(photo,index)=>{


const card =
document.createElement(
"div"
);


card.className =
"photo-card reveal";



card.innerHTML = `

<img src="${photo}"
alt="Memory ${index+1}"
loading="lazy">

`;



gallery.appendChild(card);


});


}







/*==================================================
    PHOTO TILT
==================================================*/


document
.querySelectorAll(
".photo-card"
)
.forEach(photo=>{


photo.addEventListener(
"mousemove",
(e)=>{


const rect =
photo.getBoundingClientRect();


gsap.to(
photo,
{

rotationX:
((e.clientY-rect.top)
/rect.height-.5)*15,


rotationY:
((e.clientX-rect.left)
/rect.width-.5)*-15,


transformPerspective:900,

duration:.3

}

);


});



photo.addEventListener(
"mouseleave",
()=>{


gsap.to(
photo,
{

rotationX:0,

rotationY:0,

duration:.6

}

);


});


});








/*==================================================
    MAGNETIC BUTTON
==================================================*/


document
.querySelectorAll(".btn")
.forEach(btn=>{


btn.addEventListener(
"mousemove",
(e)=>{


const r =
btn.getBoundingClientRect();


gsap.to(
btn,
{

x:
(e.clientX-r.left-r.width/2)*.25,

y:
(e.clientY-r.top-r.height/2)*.25,

duration:.3

}

);


});



btn.addEventListener(
"mouseleave",
()=>{


gsap.to(
btn,
{

x:0,

y:0,

duration:.5

}

);


});


});







/*==================================================
    GLASS TILT
==================================================*/


document
.querySelectorAll(".glass")
.forEach(card=>{


card.addEventListener(
"mousemove",
(e)=>{


const r =
card.getBoundingClientRect();


gsap.to(
card,
{

rotationX:
((e.clientY-r.top)
/r.height-.5)*10,


rotationY:
((e.clientX-r.left)
/r.width-.5)*-10,


duration:.3,

transformPerspective:1000

}

);


});


card.addEventListener(
"mouseleave",
()=>{


gsap.to(
card,
{

rotationX:0,

rotationY:0,

duration:.6

}

);


});


});







/*==================================================
    SCROLL ANIMATION
==================================================*/


gsap.utils.toArray(
".reveal"
)
.forEach(el=>{


gsap.to(
el,
{

opacity:1,

y:0,

duration:1,

scrollTrigger:{

trigger:el,

start:"top 85%"

}

}

);


});







/*==================================================
    FINAL MESSAGE
==================================================*/


let finalDone=false;



document
.getElementById(
"finishBtn"
)
?.addEventListener(
"click",
()=>{


if(finalDone)return;


finalDone=true;



document
.querySelector(".final")
?.scrollIntoView(
{
behavior:"smooth"
}
);



setTimeout(()=>{


typeWriter(
document.getElementById(
"finalText"
),
CONFIG.finalMessage,
60
);


},900);



});








/*==================================================
    REPLAY
==================================================*/


document
.getElementById(
"replayBtn"
)
?.addEventListener(
"click",
()=>{


location.reload();


});



});
