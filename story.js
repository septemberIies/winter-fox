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

$("#start-game").onclick=()=>{tone(330,.12,.02);go("cafe")};

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
    $("#cafe-status").textContent=id==="king"?"Queijo do reino não entra nesse pedido.":"Esse item não está no pedido.";
    el.classList.add("caught");
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
    if(orderIndex>=orders.length)setTimeout(()=>go("wine"),900);
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


/* VINHO — SEGURE E SOLTE */
const wineRounds=[
  {width:10.0,speed:18.5,label:"faixa média"},
  {width:6.0,speed:25.5,label:"faixa estreita"},
  {width:3.4,speed:32.5,label:"faixa mínima"}
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
  wineTargetCenter=76+Math.random()*7;
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
    +Math.sin(now/190+winePhase)*.22
    +Math.sin(now/73+winePhase*.7)*.10;

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
      setTimeout(()=>go("witch"),1100);
      return;
    }

    wineRound++;
    setTimeout(()=>resetWineAttempt("Boa. Agora a faixa ficou menor."),900);
    return;
  }

  bad();
  wineMachine.classList.add("wine-fail");

  if(wineProgress<min){
    $("#wine-status").textContent=`Ainda está quente demais — ${wineTemperature().toFixed(1)}°C.`;
  }else{
    $("#wine-status").textContent=`Passou do ponto — ${wineTemperature().toFixed(1)}°C.`;
  }

  setTimeout(()=>resetWineAttempt("Tente de novo. A velocidade muda a cada tentativa."),950);
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

    if(matches===4)setTimeout(()=>go("finale"),900);
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
