/*==================================================
    SURPRISE JOURNEY V3
    SCRIPT.JS
==================================================*/


/*==================================================
    GLOBAL SETUP
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{


gsap.registerPlugin(ScrollTrigger);



/*==================================================
    CREATE FLOATING STARS
==================================================*/


const starsContainer =
document.getElementById("stars");


function createStars(){

for(let i=0;i<120;i++){

const star =
document.createElement("span");


star.className="star";


star.style.left =
Math.random()*100+"%";


star.style.animationDuration =
(5 + Math.random()*10)+"s";


star.style.animationDelay =
(Math.random()*10)+"s";


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


window.addEventListener(
"mousemove",
(e)=>{


gsap.to(
mouseGlow,
{

x:e.clientX,

y:e.clientY,

duration:.8,

ease:"power3.out"

}
);


});




/*==================================================
    LOADER
==================================================*/


const loader =
document.getElementById("loader");


const progress =
document.getElementById("loaderProgress");


let loadValue=0;


const loaderInterval =
setInterval(()=>{


loadValue += Math.random()*8;


if(loadValue>=100){


loadValue=100;


clearInterval(loaderInterval);



gsap.to(
progress,
{
width:"100%",
duration:.5
}
);



setTimeout(()=>{


gsap.to(
loader,
{

opacity:0,

duration:1,

onComplete:()=>{

loader.remove();

startIntro();

}

}
);



},700);



}


progress.style.width =
loadValue+"%";



},150);





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

duration:1.4,

ease:"power4.out"

}
)



.from(
".badge",
{

opacity:0,

scale:.5,

duration:.8

},
"-=.8"

)



.from(
".envelope",
{

opacity:0,

scale:.5,

rotationY:180,

duration:1.5,

ease:"back.out"

},
"-=.5"

)



.from(
"#startBtn",
{

opacity:0,

y:30,

duration:1

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


startBtn.addEventListener(
"click",
()=>{


envelope.classList.add("open");



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
.scrollIntoView(
{
behavior:"smooth"
}
);


typeLetter();


},1200);



});






/*==================================================
    TYPEWRITER ENGINE
==================================================*/


function typeWriter(
element,
text,
speed=45
){


element.innerHTML="";


let index=0;



function write(){


if(index<text.length){


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



let letterStarted=false;



function typeLetter(){


if(letterStarted)
return;


letterStarted=true;



const target =
document.getElementById(
"typewriter"
);



typeWriter(
target,
CONFIG.letter
);


}




/*==================================================
    CONTINUE BUTTON
==================================================*/


const continueBtn =
document.getElementById(
"continueBtn"
);



continueBtn.addEventListener(
"click",
()=>{


document
.querySelector(".journey")
.scrollIntoView(
{
behavior:"smooth"
}
);



}
);







/*==================================================
    JOURNEY BUTTON
==================================================*/


document
.getElementById("journeyBtn")
.addEventListener(
"click",
()=>{


document
.querySelector(".gallery")
.scrollIntoView(
{
behavior:"smooth"
}
);



}
);







/*==================================================
    CREATE GALLERY
==================================================*/


const gallery =
document.getElementById(
"galleryGrid"
);



CONFIG.photos.forEach(
(photo,index)=>{


const card =
document.createElement("div");


card.className="photo-card reveal";



card.innerHTML = `

<img src="${photo}" alt="Memory ${index+1}">

`;



gallery.appendChild(card);



}
);





/*==================================================
    SCROLL ANIMATIONS
==================================================*/


gsap.utils.toArray(
".reveal"
)
.forEach(item=>{


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







/*==================================================
    FINAL MESSAGE
==================================================*/


const finishBtn =
document.getElementById(
"finishBtn"
);



let finalStarted=false;



finishBtn.addEventListener(
"click",
()=>{


if(finalStarted)
return;


finalStarted=true;



document
.querySelector(".final")
.scrollIntoView(
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
.getElementById("replayBtn")
.addEventListener(
"click",
()=>{
window.scrollTo(
{
top:0,
behavior:"smooth"
}
);
setTimeout(()=>{
location.reload();
},1200);
});
});
