const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const scenes=["title","cafe","wine","witch","journal","finale"];
let current="title";

function show(id){
  scenes.forEach(x=>document.getElementById(x)?.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  current=id;
}
function go(id){
  const t=$("#transition");
  t.classList.add("on");
  setTimeout(()=>{show(id);t.classList.remove("on")},360);
}
function toast(msg){
  const e=$("#toast");
  e.textContent=msg;
  e.classList.remove("hidden");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>e.classList.add("hidden"),1500);
}
function tone(f=440,d=.06,v=.014){
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A)return;
    window.__audio??=new A();
    const c=window.__audio;
    if(c.state==="suspended")c.resume();
    const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;
    o.type="triangle";o.frequency.value=f;
    g.gain.setValueAtTime(.0001,n);
    g.gain.exponentialRampToValueAtTime(v,n+.01);
    g.gain.exponentialRampToValueAtTime(.0001,n+d);
    o.connect(g);g.connect(c.destination);
    o.start(n);o.stop(n+d+.02);
  }catch{}
}
function good(){tone(620,.11,.022);setTimeout(()=>tone(850,.14,.015),65)}
function bad(){tone(175,.08,.013)}
function snow(id,n){
  const root=document.getElementById(id);if(!root)return;
  for(let i=0;i<n;i++){
    const f=document.createElement("i");
    f.className="snowflake";
    const s=.8+Math.random()*2.3,d=7+Math.random()*8,dr=-55+Math.random()*110;
    f.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;opacity:${(.16+Math.random()*.5).toFixed(2)};--drift:${dr}px;animation:fall ${d}s linear ${-Math.random()*12}s infinite,sway ${d*.7}s ease-in-out infinite alternate`;
    root.appendChild(f);
  }
}

function openIntroLetter(){
  $("#intro-letter-modal").classList.add("open");
  $("#intro-letter-modal").setAttribute("aria-hidden","false");
  document.body.classList.add("letter-open");
  playStageMusic(4);
}

function closeIntroLetter(){
  stopStageMusic();
  $("#intro-letter-modal").classList.remove("open");
  $("#intro-letter-modal").setAttribute("aria-hidden","true");
  document.body.classList.remove("letter-open");
  orderIndex=0;
  setupOrder();
  setTimeout(()=>go("cafe"),160);
}

const startGameButton=$("#start-game");
const introLetterClose=$("#intro-letter-close");
if(startGameButton)startGameButton.onclick=openIntroLetter;
if(introLetterClose)introLetterClose.onclick=closeIntroLetter;

function showCafeLetter(){
  $("#cafe-letter-modal").classList.add("open");
  $("#cafe-letter-modal").setAttribute("aria-hidden","false");
  document.body.classList.add("letter-open");
}

function closeCafeLetter(){
  stopStageMusic();
  $("#cafe-letter-modal").classList.remove("open");
  $("#cafe-letter-modal").setAttribute("aria-hidden","true");
  document.body.classList.remove("letter-open");
  setTimeout(()=>go("wine"),160);
}

const cafeLetterClose=$("#cafe-letter-close");
if(cafeLetterClose)cafeLetterClose.onclick=closeCafeLetter;

function showWineLetter(){
  $("#wine-letter-modal").classList.add("open");
  $("#wine-letter-modal").setAttribute("aria-hidden","false");
  document.body.classList.add("letter-open");
}

function closeWineLetter(){
  stopStageMusic();
  $("#wine-letter-modal").classList.remove("open");
  $("#wine-letter-modal").setAttribute("aria-hidden","true");
  document.body.classList.remove("letter-open");
  setTimeout(()=>go("witch"),160);
}

const wineLetterClose=$("#wine-letter-close");
if(wineLetterClose)wineLetterClose.onclick=closeWineLetter;


/* ESTEIRA */
const foods={
  brie:{label:"Brie",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0105.png"},
  wine:{label:"Vinho gelado",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0098.png"},
  pudding:{label:"Pudim",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0109.png"},
  shake:{label:"Milkshake",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0089.png"},
  king:{label:"Queijo do reino",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0106.png"},
  dessert:{label:"Doce de baunilha",img:"https://raw.githubusercontent.com/redamajlal/kitchen-nightmare/main/assets/kenney_pixel-platformer-food-expansion/Tiles/tile_0108.png"}
};
const orders=[
  {title:"Noite fria",need:["brie","wine"]},
  {title:"Sobremesa",need:["pudding","shake"]},
  {title:"Mesa dela",need:["brie","wine","pudding","shake"]}
];

let orderIndex=0,caught=new Set(),conveyorItems=[],conveyorTimer=null,conveyorRaf=null;

function renderTray(){
  $("#tray").innerHTML=[...caught].map(x=>`<span>${foods[x].label}</span>`).join("");
}
function setupOrder(){
  const o=orders[orderIndex];
  $("#order-index").textContent=orderIndex+1;
  $("#order-title").textContent=o.title;
  $("#order-needed").innerHTML=o.need.map(x=>`<span>${foods[x].label}</span>`).join("");
  caught.clear();
  renderTray();
  $("#cafe-status").textContent="Pegue somente os itens do pedido.";
  startConveyor();
}
function spawnFood(){
  const ids=Object.keys(foods);
  const id=ids[Math.floor(Math.random()*ids.length)];
  const el=document.createElement("button");
  el.className="conveyor-item";
  el.dataset.food=id;
  el.dataset.x=$("#conveyor").clientWidth+120;
  el.innerHTML=`<img src="${foods[id].img}" alt=""><b>${foods[id].label}</b>`;
  el.style.left=el.dataset.x+"px";
  el.onclick=()=>catchFood(el,id);
  $("#conveyor").appendChild(el);
  conveyorItems.push(el);
}
function catchFood(el,id){
  if(el.classList.contains("caught"))return;
  const o=orders[orderIndex];

  if(!o.need.includes(id)){
    bad();
    el.classList.add("caught");
    stopConveyor();
    orderIndex=0;
    caught.clear();
    renderTray();
    $("#cafe-status").textContent="Item errado — voltando para o começo.";
    setTimeout(setupOrder,850);
    return;
  }

  if(caught.has(id)){
    toast("Esse item já está na bandeja.");
    el.classList.add("caught");
    return;
  }

  caught.add(id);
  el.classList.add("caught");
  good();
  renderTray();
  $("#cafe-status").textContent=`${caught.size} de ${o.need.length} itens pegos.`;

  if(caught.size===o.need.length){
    stopConveyor();
    $("#cafe-status").textContent="Pedido completo!";
    orderIndex++;
    if(orderIndex>=orders.length){playStageMusic(5);setTimeout(showCafeLetter,700);}
    else setTimeout(setupOrder,700);
  }
}
function conveyorLoop(){
  conveyorItems=[...conveyorItems].filter(el=>{
    const x=+el.dataset.x-2.2;
    el.dataset.x=x;
    el.style.left=x+"px";
    if(x<-130){el.remove();return false}
    return true;
  });
  conveyorRaf=requestAnimationFrame(conveyorLoop);
}
function startConveyor(){
  stopConveyor();
  $("#conveyor").querySelectorAll(".conveyor-item").forEach(x=>x.remove());
  conveyorItems=[];
  spawnFood();
  conveyorTimer=setInterval(spawnFood,900);
  conveyorRaf=requestAnimationFrame(conveyorLoop);
}
function stopConveyor(){
  clearInterval(conveyorTimer);
  cancelAnimationFrame(conveyorRaf);
  conveyorTimer=null;conveyorRaf=null;
}
setupOrder();
stopConveyor();
$("#conveyor").querySelectorAll(".conveyor-item").forEach(x=>x.remove());
conveyorItems=[];


/* VINHO — SEGURE E SOLTE */
const wineRounds=[
  {width:8.0,speed:22.0,label:"faixa estreita"},
  {width:5.0,speed:30.0,label:"faixa difícil"},
  {width:3.0,speed:38.0,label:"faixa brutal"}
];

let wineRound=0;
let wineProgress=0;
let wineHolding=false;
let wineLocked=false;
let wineRaf=null;
let wineLast=0;
let winePhase=Math.random()*Math.PI*2;
let wineTargetCenter=77;
let wineTargetWidth=wineRounds[0].width;

const wineButton=$("#cool-wine");
const wineMachine=$("#wine-machine");
const wineMarker=$("#wine-marker");
const wineTarget=$("#wine-target");

function wineTemperature(){
  return Math.max(0,18-(wineProgress*.18));
}
function renderWine(){
  wineMarker.style.left=wineProgress+"%";
  $("#wine-temp").textContent=wineTemperature().toFixed(1)+"°C";
}
function randomizeWineTarget(){
  const cfg=wineRounds[wineRound];
  wineTargetWidth=cfg.width;
  wineTargetCenter=72+Math.random()*15;
  const left=wineTargetCenter-wineTargetWidth/2;
  wineTarget.style.left=left+"%";
  wineTarget.style.width=wineTargetWidth+"%";
}
function resetWineAttempt(message="Segure para começar a resfriar."){
  wineProgress=0;
  wineHolding=false;
  wineLocked=false;
  wineLast=0;
  winePhase=Math.random()*Math.PI*2;
  wineButton.classList.remove("holding");
  wineMachine.classList.remove("cooling","wine-fail","wine-success");
  randomizeWineTarget();
  renderWine();
  $("#wine-status").textContent=message;
  $("#wine-round").textContent=`Rodada ${wineRound+1} de 3`;
}
function startWineHold(e){
  if(current!=="wine"||wineLocked||wineHolding)return;
  if(e?.preventDefault)e.preventDefault();
  wineHolding=true;
  wineLast=performance.now();
  wineButton.classList.add("holding");
  wineMachine.classList.add("cooling");
  $("#wine-status").textContent="Resfriando... solte na faixa dourada!";
  tone(260,.07,.009);
  wineRaf=requestAnimationFrame(wineLoop);
}
function wineLoop(now){
  if(!wineHolding)return;
  const dt=Math.min(.035,(now-wineLast)/1000);
  wineLast=now;

  const cfg=wineRounds[wineRound];
  const irregular=
    1
    +Math.sin(now/150+winePhase)*.28
    +Math.sin(now/59+winePhase*.7)*.14
    +Math.sin(now/37+winePhase*1.35)*.07;

  wineProgress+=cfg.speed*irregular*dt;
  wineProgress=Math.min(100,wineProgress);
  renderWine();

  if(wineProgress>=100){
    finishWineHold();
    return;
  }
  wineRaf=requestAnimationFrame(wineLoop);
}
function finishWineHold(e){
  if(e?.preventDefault)e.preventDefault();
  if(!wineHolding||wineLocked)return;

  wineHolding=false;
  wineLocked=true;
  cancelAnimationFrame(wineRaf);
  wineButton.classList.remove("holding");
  wineMachine.classList.remove("cooling");

  const min=wineTargetCenter-wineTargetWidth/2;
  const max=wineTargetCenter+wineTargetWidth/2;
  const success=wineProgress>=min&&wineProgress<=max;

  if(success){
    good();
    wineMachine.classList.add("wine-success");
    $("#wine-status").textContent=`Perfeito — ${wineTemperature().toFixed(1)}°C.`;

    if(wineRound===wineRounds.length-1){
      playStageMusic(6);
      setTimeout(showWineLetter,900);
      return;
    }

    wineRound++;
    setTimeout(()=>resetWineAttempt("Boa. Agora a faixa ficou menor."),900);
    return;
  }

  bad();
  wineMachine.classList.add("wine-fail");

  const failReason=wineProgress<min
    ? `Ainda está quente demais — ${wineTemperature().toFixed(1)}°C.`
    : `Passou do ponto — ${wineTemperature().toFixed(1)}°C.`;

  $("#wine-status").textContent=failReason+" Voltando para a Rodada 1...";
  wineRound=0;

  setTimeout(()=>resetWineAttempt("Errou, voltou para a Rodada 1. Segure para tentar de novo."),1150);
}

wineButton.addEventListener("pointerdown",startWineHold);
window.addEventListener("pointerup",finishWineHold);
window.addEventListener("pointercancel",finishWineHold);

resetWineAttempt();


/* BRUXARIA */
const ritualButtons=$$("#ritual-items button");
const ritualIds=ritualButtons.map(x=>x.dataset.ritual);
let ritualRound=1,sequence=[],input=[],showing=false;

function showSequence(){
  if(showing)return;
  sequence=Array.from({length:ritualRound+2},()=>ritualIds[Math.floor(Math.random()*ritualIds.length)]);
  input=[];
  showing=true;
  $("#show-ritual").disabled=true;
  $("#ritual-status").textContent="Observe a ordem.";

  let i=0;
  const step=()=>{
    if(i>=sequence.length){
      showing=false;
      $("#show-ritual").disabled=false;
      $("#ritual-status").textContent="Agora repita.";
      return;
    }

    const b=$(`[data-ritual="${sequence[i]}"]`);
    b.classList.add("flash");
    tone(500+i*45,.07,.01);

    setTimeout(()=>{
      b.classList.remove("flash");
      i++;
      setTimeout(step,220);
    },470);
  };
  step();
}

$("#show-ritual").onclick=showSequence;

ritualButtons.forEach(btn=>btn.onclick=()=>{
  if(showing||!sequence.length)return;

  btn.classList.add("flash");
  setTimeout(()=>btn.classList.remove("flash"),170);

  const pos=input.length;
  input.push(btn.dataset.ritual);

  if(input[pos]!==sequence[pos]){
    bad();
    sequence=[];
    input=[];
    $("#ritual-status").textContent="Errou. Clique em “Ver sequência” para tentar novamente.";
    return;
  }

  tone(650+pos*35,.045,.009);

  if(input.length===sequence.length){
    good();

    if(ritualRound===3){
      $("#ritual-status").textContent="Ritual completo!";
      playStageMusic(3);
      setTimeout(()=>go("journal"),900);
      return;
    }

    ritualRound++;
    $("#ritual-round").textContent=`Rodada ${ritualRound} de 3`;
    sequence=[];
    input=[];
    $("#ritual-status").textContent="Certo. A próxima sequência será maior.";
  }
});

/* PINS */
const iconBase="https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/";
const pairs=[
  {id:"paris",label:"Paris",icon:iconBase+"map-pin.svg"},
  {id:"home",label:"Apartamento",icon:iconBase+"home.svg"},
  {id:"flower",label:"Flores",icon:iconBase+"flower.svg"},
  {id:"love",label:"Romance",icon:iconBase+"heart.svg"}
];

let cards=[...pairs,...pairs].map((x,i)=>({...x,uid:i})).sort(()=>Math.random()-.5);
let open=[],matches=0,lock=false;
const grid=$("#memory-grid");

cards.forEach(card=>{
  const b=document.createElement("button");
  b.className="memory-card";
  b.dataset.pair=card.id;
  b.innerHTML=`<span class="memory-face memory-back"></span><span class="memory-face memory-front"><img src="${card.icon}" alt=""><b>${card.label}</b></span>`;
  b.onclick=()=>flipCard(b);
  grid.appendChild(b);
});

function flipCard(card){
  if(lock||card.classList.contains("flipped")||card.classList.contains("matched"))return;

  card.classList.add("flipped");
  open.push(card);
  tone(480,.035,.007);

  if(open.length<2)return;

  lock=true;

  if(open[0].dataset.pair===open[1].dataset.pair){
    open.forEach(x=>x.classList.add("matched"));
    open=[];
    matches++;
    lock=false;
    good();
    $("#memory-progress").textContent=`${matches} / 4 pares`;

    if(matches===4){playStageMusic(4);setTimeout(()=>go("finale"),900);}
  }else{
    setTimeout(()=>{
      open.forEach(x=>x.classList.remove("flipped"));
      open=[];
      lock=false;
      bad();
    },700);
  }
}

$("#replay").onclick=()=>location.reload();

document.addEventListener("keydown",e=>{
  if(current==="title"&&e.key==="Enter")$("#start-game").click();
  if(current==="wine"&&e.code==="Space"&&!e.repeat){
    e.preventDefault();
    startWineHold(e);
  }
});
document.addEventListener("keyup",e=>{
  if(current==="wine"&&e.code==="Space"){
    e.preventDefault();
    finishWineHold(e);
  }
});

snow("title-snow",90);
snow("final-snow",95);


/* CLICK HEART — dotted neon heart */
(function(){
  const HEART_DOTS=28;
  const SPARKS=6;

  function createClickHeart(x,y){
    const heart=document.createElement("div");
    heart.className="click-heart";
    heart.style.left=x+"px";
    heart.style.top=y+"px";

    for(let i=0;i<HEART_DOTS;i++){
      const t=(Math.PI*2*i)/HEART_DOTS;
      const px=16*Math.pow(Math.sin(t),3);
      const py=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));

      const dot=document.createElement("i");
      dot.className="click-heart-dot";
      dot.style.setProperty("--x",(px*1.25)+"px");
      dot.style.setProperty("--y",(py*1.25)+"px");
      dot.style.setProperty("--delay",(Math.random()*35)+"ms");
      heart.appendChild(dot);
    }

    for(let i=0;i<SPARKS;i++){
      const a=(Math.PI*2*i)/SPARKS+(Math.random()-.5)*.45;
      const d=28+Math.random()*16;
      const spark=document.createElement("b");
      spark.className="click-heart-spark";
      spark.style.setProperty("--sx",(Math.cos(a)*d)+"px");
      spark.style.setProperty("--sy",(Math.sin(a)*d)+"px");
      spark.style.setProperty("--sd",(Math.random()*100)+"ms");
      heart.appendChild(spark);
    }

    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),1550);
  }

  window.addEventListener("pointerdown",(e)=>{
    if(e.pointerType==="mouse" && e.button!==0)return;
    createClickHeart(e.clientX,e.clientY);
  },{passive:true});
})();


/* STAGE MUSIC — menu + one different song after each minigame */
const MUSIC_TRACKS=[
  {title:"Wonderwall",src:"assets/music/Oasis - Wonderwall (Official Video).mp3"},
  {title:"Drowning",src:"assets/music/A Boogie Wit Da Hoodie - Drowning (feat. Kodak Black) Official Audio.mp3"},
  {title:"Without Me",src:"assets/music/Halsey - Without Me.mp3"},
  {title:"Cinderella",src:"assets/music/Mac Miller - Cinderella (feat. Ty Dolla ign).mp3"},
  {title:"The First Time",src:"assets/music/Damiano David - The First Time (Official Visual Video) (1).mp3"},
  {title:"M",src:"assets/music/Anil Emre Daldal - M.mp3"},
  {title:"Die For You (Remix)",src:"assets/music/The Weeknd, Ariana Grande - Die For You (Remix Lyric Video) (1).mp3"}
];

const bgMusic=new Audio();
bgMusic.preload="auto";
bgMusic.volume=.24;
bgMusic.loop=true;

let activeMusicIndex=-1;
let musicUnlocked=false;
let musicSwitchToken=0;

async function playStageMusic(index){
  if(index<0||index>=MUSIC_TRACKS.length)return;
  musicUnlocked=true;

  if(activeMusicIndex===index&&!bgMusic.paused)return;

  const token=++musicSwitchToken;
  const track=MUSIC_TRACKS[index];
  activeMusicIndex=index;

  try{
    bgMusic.pause();
    bgMusic.src=encodeURI(track.src);
    bgMusic.currentTime=0;
    bgMusic.loop=true;
    bgMusic.volume=.24;
    await bgMusic.play();
    if(token!==musicSwitchToken)bgMusic.pause();
  }catch(err){
    // Autoplay can be blocked until the user interacts.
  }
}

function stopStageMusic(){
  musicSwitchToken++;
  bgMusic.pause();
  bgMusic.currentTime=0;
}

function startMenuMusic(){
  if(musicUnlocked)return;
  playStageMusic(4);
}

/* Start the menu song on the first real user interaction. */
window.addEventListener("pointerdown",startMenuMusic,{once:true,passive:true});
window.addEventListener("keydown",startMenuMusic,{once:true});


/* MUSIC MUTE TOGGLE */
const musicToggle=$("#music-toggle");
let musicMuted=false;

function syncMusicToggle(){
  if(!musicToggle)return;
  musicToggle.classList.toggle("muted",musicMuted);
  musicToggle.setAttribute("aria-pressed",musicMuted?"true":"false");
  musicToggle.setAttribute("aria-label",musicMuted?"Ativar música":"Mutar música");
  musicToggle.title=musicMuted?"Ativar música":"Mutar música";
  $(".music-toggle-text").textContent=musicMuted?"UNMUTE MUSIC":"MUTE MUSIC";
  $(".music-toggle-icon").textContent=musicMuted?"×":"♪";
}

if(musicToggle){
  musicToggle.addEventListener("click",()=>{
    musicMuted=!musicMuted;
    bgMusic.muted=musicMuted;
    syncMusicToggle();
  });
  syncMusicToggle();
}
