const startBtn=document.getElementById("startJourneyBtn");
const envelope=document.getElementById("envelope");
let isAnimating=false;

function disableButton(){
startBtn.disabled=true;
startBtn.style.opacity=".6";
}

function enableButton(){
startBtn.disabled=false;
startBtn.style.opacity="1";
}

function fadeButton(){
startBtn.style.transition=".4s";
startBtn.style.opacity="0";
startBtn.style.transform="translateY(15px)";
}

function bounceEnvelope(){
envelope.animate([
{transform:"translateY(0) scale(1)"},
{transform:"translateY(-12px) scale(1.03)"},
{transform:"translateY(0) scale(1)"}
],{
duration:450,
easing:"ease-out"
});
}

function openEnvelope(){
envelope.classList.add("open");
}

function revealLetter(){
const letter=document.querySelector(".letter");
letter.style.zIndex="20";
letter.style.transition="1s cubic-bezier(.22,1,.36,1)";
letter.style.transform="translateX(-50%) translateY(-140px) scale(1.05)";
}

function startSequence(){

if(isAnimating)return;

isAnimating=true;

disableButton();

fadeButton();

setTimeout(()=>{
bounceEnvelope();
},300);

setTimeout(()=>{
openEnvelope();
},700);

setTimeout(()=>{
revealLetter();
},1400);

setTimeout(()=>{
isAnimating=false;
},2500);

}

startBtn.addEventListener("click",startSequence);
