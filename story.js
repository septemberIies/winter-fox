const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const scenes=["title","cafe","witch","journal","finale"];
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
    if(orderIndex>=orders.length)setTimeout(()=>go("witch"),900);
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
});

snow("title-snow",90);
snow("final-snow",95);
