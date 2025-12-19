/* =========================
   BINARY RAIN (ADAPTIVE)
========================= */
const canvas = document.getElementById("binaryRain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const fontSize = 18;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function css(v) {
  return getComputedStyle(document.body).getPropertyValue(v);
}

function drawBinary() {
  ctx.fillStyle = css("--binary-fade");
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = css("--binary-color");
  ctx.font = fontSize + "px monospace";

  drops.forEach((y,i)=>{
    const t = Math.random()>0.5?"0":"1";
    ctx.fillText(t, i*fontSize, y*fontSize);
    if (y*fontSize > canvas.height && Math.random()>0.985) drops[i]=0;
    drops[i]++;
  });
}

setInterval(drawBinary, innerWidth < 768 ? 80 : 45);

/* =========================
   TYPING EFFECT
========================= */
const texts = [
  "AI Engineer",
  "Image Processing Enthusiast",
  "Robotics Developer",
  "Programming Learner"
];

let t=0,c=0;
const el = document.getElementById("typing");

(function type(){
  el.textContent = texts[t].slice(0,++c);
  if(c===texts[t].length){
    setTimeout(()=>{c=0;t=(t+1)%texts.length},1500);
  }
  setTimeout(type,90);
})();

/* =========================
   LANGUAGE TOGGLE
========================= */
document.getElementById("langToggle").onclick=()=>{
  document.querySelectorAll(".lang").forEach(e=>e.classList.toggle("hidden"));
};

/* =========================
   FILTERS
========================= */
function filter(btnId, gridId){
  const btns=document.querySelectorAll(`#${btnId} button`);
  const cards=document.querySelectorAll(`#${gridId} .card`);
  btns.forEach(b=>{
    b.onclick=()=>{
      btns.forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const f=b.dataset.filter;
      cards.forEach(c=>{
        c.style.display=(f==="all"||c.dataset.category===f)?"block":"none";
      });
    };
  });
}

filter("skillFilters","skillGrid");
filter("projectFilters","projectGrid");

/* =========================
   THEME TOGGLE
========================= */
const themeBtn=document.createElement("button");
themeBtn.textContent="🌙 / ☀️";
themeBtn.style.position="fixed";
themeBtn.style.top="15px";
themeBtn.style.right="15px";
themeBtn.style.zIndex="999";
document.body.appendChild(themeBtn);

themeBtn.onclick=()=>document.body.classList.toggle("light");
