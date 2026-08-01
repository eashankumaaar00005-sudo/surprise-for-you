/*==================================================
    SURPRISE JOURNEY V3
    FINAL SCRIPT.JS V2 PART 1
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

gsap.registerPlugin(ScrollTrigger);

/*==================================================
    VARIABLES
==================================================*/

const CONFIG_READY=typeof CONFIG!=="undefined";
let journeyUnlocked=false;
let letterDone=false;
let finalDone=false;

/*==================================================
    CONFIG APPLY
==================================================*/

if(CONFIG_READY){

document.title=CONFIG.title;

const heroTitle=document.querySelector(".hero-card h1");

if(heroTitle){
heroTitle.innerHTML=CONFIG.title.replaceAll(" ","<br>");
}

}

/*==================================================
    SCROLL LOCK
==================================================*/

document.body.classList.add("locked");

function unlockJourney(){

journeyUnlocked=true;

document.body.classList.remove("locked");

}

/*==================================================
    STARS
==================================================*/

const stars=document.getElementById("stars");

function createStars(){

if(!stars)return;

const count=window.innerWidth<768?50:120;

for(let i=0;i<count;i++){

const star=document.createElement("span");

star.className="star";

star.style.left=Math.random()*100+"%";
star.style.top=Math.random()*100+"%";
star.style.animationDuration=(5+Math.random()*10)+"s";
star.style.animationDelay=Math.random()*10+"s";

stars.appendChild(star);

}

}

createStars();

/*==================================================
    MOUSE GLOW
==================================================*/

const mouseGlow=document.getElementById("mouseGlow");

if(mouseGlow){

window.addEventListener("mousemove",(e)=>{

gsap.to(mouseGlow,{
x:e.clientX,
y:e.clientY,
duration:.8,
ease:"power3.out"
});

});

}

/*==================================================
    LOADER
==================================================*/

const loader=document.getElementById("loader");
const progress=document.getElementById("loaderProgress");

function removeLoader(){

if(!loader){

startIntro();

return;

}

gsap.to(loader,{
opacity:0,
duration:1,
onComplete:()=>{

loader.remove();

startIntro();

}

});

}

if(progress){

let value=0;

const timer=setInterval(()=>{

value+=Math.random()*10;

progress.style.width=value+"%";

if(value>=100){

clearInterval(timer);

progress.style.width="100%";

setTimeout(removeLoader,700);

}

},120);

}else{

removeLoader();

}

/*==================================================
    HERO INTRO
==================================================*/

function startIntro(){

const tl=gsap.timeline();

tl.from(".hero-card",{
opacity:0,
y:100,
scale:.95,
duration:1.5,
ease:"power4.out"
})
.from(".badge",{
opacity:0,
y:-30,
duration:.8
},"-=.8")
.from(".hero-card h1",{
opacity:0,
y:60,
filter:"blur(15px)",
duration:1.2
},"-=.5")
.from(".hero-card p",{
opacity:0,
y:40,
duration:1
},"-=.7")
.from(".envelope",{
opacity:0,
scale:.5,
rotationY:180,
duration:1.5,
ease:"back.out"
},"-=.5")
.from("#startBtn",{
opacity:0,
y:30,
duration:1
},"-=.5");

}

/*==================================================
    ENVELOPE
==================================================*/

const envelope=document.getElementById("envelope");
const startBtn=document.getElementById("startBtn");

if(startBtn&&envelope){

startBtn.addEventListener("click",()=>{

unlockJourney();

envelope.classList.add("open");

gsap.to(startBtn,{
opacity:0,
scale:0,
duration:.5
});

setTimeout(()=>{

document.querySelector(".letter")?.scrollIntoView({
behavior:"smooth"
});

typeLetter();

},1200);

});

}

/*==================================================
    TYPEWRITER
==================================================*/

function typeWriter(element,text,speed=45){

if(!element||!text)return;

element.innerHTML="";

let index=0;

function write(){

if(index<text.length){

element.innerHTML+=text.charAt(index);

index++;

setTimeout(write,speed);

}

}

write();

}

function typeLetter(){

if(letterDone||!CONFIG_READY)return;

letterDone=true;

typeWriter(
document.getElementById("typewriter"),
CONFIG.letter
);

}

/*==================================================
    BUTTON NAVIGATION
==================================================*/

document.getElementById("continueBtn")?.addEventListener("click",()=>{

document.querySelector(".journey")?.scrollIntoView({
behavior:"smooth"
});

});

document.getElementById("journeyBtn")?.addEventListener("click",()=>{

document.querySelector(".gallery")?.scrollIntoView({
behavior:"smooth"
});

});

/*==================================================
    GALLERY CREATE
==================================================*/

const gallery=document.getElementById("galleryGrid");

if(gallery&&CONFIG_READY){

CONFIG.photos.forEach((photo,index)=>{

const card=document.createElement("div");

card.className="photo-card reveal";

const img=document.createElement("img");

img.src=photo;
img.alt=`Memory ${index+1}`;
img.loading="lazy";

card.appendChild(img);

gallery.appendChild(card);

});

}

ScrollTrigger.refresh();

    /*==================================================
    GALLERY LIGHTBOX
==================================================*/

function openViewer(src){

const overlay=document.createElement("div");

overlay.className="image-viewer";

overlay.innerHTML=`
<img src="${src}">
`;

document.body.appendChild(overlay);

gsap.from(overlay,{
opacity:0,
duration:.5
});

overlay.addEventListener("click",()=>{

gsap.to(overlay,{
opacity:0,
duration:.4,
onComplete:()=>overlay.remove()
});

});

}

document.querySelectorAll(".photo-card img").forEach(img=>{

img.addEventListener("click",()=>{

openViewer(img.src);

});

});


/*==================================================
    GOLD PARTICLES
==================================================*/

let particleTime=0;

function createParticle(x,y){

const particle=document.createElement("span");

particle.className="gold-particle";

particle.style.left=x+"px";
particle.style.top=y+"px";

document.body.appendChild(particle);

gsap.to(particle,{
y:-80,
opacity:0,
scale:0,
duration:1,
onComplete:()=>particle.remove()
});

}

window.addEventListener("mousemove",(e)=>{

const now=Date.now();

if(now-particleTime>80){

particleTime=now;

if(Math.random()>.75){

createParticle(
e.clientX,
e.clientY
);

}

}

});


/*==================================================
    MAGNETIC BUTTON
==================================================*/

document.querySelectorAll(".btn").forEach(btn=>{

btn.addEventListener("mousemove",(e)=>{

const rect=btn.getBoundingClientRect();

gsap.to(btn,{
x:(e.clientX-rect.left-rect.width/2)*.25,
y:(e.clientY-rect.top-rect.height/2)*.25,
duration:.3
});

});

btn.addEventListener("mouseleave",()=>{

gsap.to(btn,{
x:0,
y:0,
duration:.5,
ease:"elastic.out(1,.3)"
});

});

});


/*==================================================
    GLASS TILT DESKTOP ONLY
==================================================*/

if(window.innerWidth>768){

document.querySelectorAll(".glass").forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const rotateX=((e.clientY-rect.top)/rect.height-.5)*10;

const rotateY=((e.clientX-rect.left)/rect.width-.5)*-10;

gsap.to(card,{
rotationX:rotateX,
rotationY:rotateY,
transformPerspective:1000,
duration:.3
});

});


card.addEventListener("mouseleave",()=>{

gsap.to(card,{
rotationX:0,
rotationY:0,
duration:.6
});

});

});

}


/*==================================================
    PHOTO TILT
==================================================*/

if(window.innerWidth>768){

document.querySelectorAll(".photo-card").forEach(photo=>{

photo.addEventListener("mousemove",(e)=>{

const rect=photo.getBoundingClientRect();

gsap.to(photo,{
rotationX:((e.clientY-rect.top)/rect.height-.5)*15,
rotationY:((e.clientX-rect.left)/rect.width-.5)*-15,
transformPerspective:900,
duration:.3
});

});


photo.addEventListener("mouseleave",()=>{

gsap.to(photo,{
rotationX:0,
rotationY:0,
duration:.6
});

});

});

}


/*==================================================
    SCROLL REVEAL
==================================================*/

gsap.utils.toArray(".reveal").forEach(element=>{

gsap.to(element,{
opacity:1,
y:0,
duration:1,
scrollTrigger:{
trigger:element,
start:"top 85%"
}
});

});


/*==================================================
    JOURNEY ANIMATION
==================================================*/

gsap.from(".stop",{

scale:0,
opacity:0,
duration:.8,
stagger:.3,

scrollTrigger:{
trigger:".journey-line",
start:"top 75%"
}

});


gsap.from(".road",{

scaleX:0,
transformOrigin:"left",
duration:1,
stagger:.4,

scrollTrigger:{
trigger:".journey-line",
start:"top 75%"
}

});


/*==================================================
    FINAL MESSAGE
==================================================*/

document.getElementById("finishBtn")?.addEventListener("click",()=>{

if(finalDone||!CONFIG_READY)return;

finalDone=true;

document.querySelector(".final")?.scrollIntoView({
behavior:"smooth"
});

setTimeout(()=>{

typeWriter(
document.getElementById("finalText"),
CONFIG.finalMessage,
60
);

},900);

});


/*==================================================
    REPLAY
==================================================*/

document.getElementById("replayBtn")?.addEventListener("click",()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

setTimeout(()=>{

location.reload();

},1000);

});
});
