const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const scenes=["title","paris","boutique","cafe","witch","journal","finale"];let current="title";
function show(id){scenes.forEach(x=>document.getElementById(x)?.classList.remove("active"));document.getElementById(id)?.classList.add("active");current=id}
function go(id){const t=$("#transition");t.classList.add("on");setTimeout(()=>{show(id);t.classList.remove("on")},360)}
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.remove("hidden");clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.add("hidden"),1500)}
function tone(f=440,d=.06,v=.014){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;window.__audio??=new A();const c=window.__audio;if(c.state==="suspended")c.resume();const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(v,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+d+.02)}catch{}}
function good(){tone(620,.11,.022);setTimeout(()=>tone(850,.14,.015),65)}function bad(){tone(175,.08,.013)}
function snow(id,n){const root=document.getElementById(id);if(!root)return;for(let i=0;i<n;i++){const f=document.createElement("i");f.className="snowflake";const s=.8+Math.random()*2.3,d=7+Math.random()*8,dr=-55+Math.random()*110;f.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;opacity:${(.16+Math.random()*.5).toFixed(2)};--drift:${dr}px;animation:fall ${d}s linear ${-Math.random()*12}s infinite,sway ${d*.7}s ease-in-out infinite alternate`;root.appendChild(f)}}
$("#start-game").onclick=()=>{tone(330,.12,.02);go("paris")};

/* PARIS DIALOGUE + GRID NAVIGATION */
const lines=["Paris parece mais bonita quando está fria, não acha?","Eu preparei algumas coisas que têm a sua cara.","Siga minhas pegadas. Eu espero você do outro lado."];
let line=0,dialogueOpen=false;
function openDialogue(){if(dialogueOpen||!$("#paris-game").classList.contains("hidden"))return;dialogueOpen=true;line=0;$("#talk-fox").classList.add("hidden");$("#dialogue").classList.remove("hidden");$("#dialogue-text").textContent=lines[0];$("#paris-objective").textContent="Ouça a raposa";tone()}
function advance(){if(!dialogueOpen)return;line++;tone(510,.04,.01);if(line<lines.length){$("#dialogue-text").textContent=lines[line];return}dialogueOpen=false;$("#dialogue").classList.add("hidden");$("#paris-game").classList.remove("hidden");$("#paris-objective").textContent="Siga as pegadas";buildParisBoard()}
$("#talk-fox").onclick=openDialogue;$("#dialogue-next").onclick=advance;

const cols=5,rows=4;
const parisPath=[15,10,11,6,7,2];
let parisPos=parisPath[0],parisStep=0;
function buildParisBoard(){
  const board=$("#paris-board");board.innerHTML="";
  for(let i=0;i<cols*rows;i++){const c=document.createElement("div");c.className="paris-cell";c.dataset.cell=i;if(parisPath.includes(i))c.classList.add("path");if(i===parisPath.at(-1))c.classList.add("finish");board.appendChild(c)}
  renderParis()
}
function renderParis(){
  $$(".paris-cell").forEach(c=>{c.classList.remove("player","visited");const i=+c.dataset.cell;if(i===parisPos)c.classList.add("player");if(parisPath.slice(0,parisStep+1).includes(i))c.classList.add("visited")});
  $("#paris-steps").textContent=`${parisStep} / 5 passos`;
}
function moveParis(dir){
  if(current!=="paris"||$("#paris-game").classList.contains("hidden"))return;
  const r=Math.floor(parisPos/cols),c=parisPos%cols;
  const delta={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]}[dir];if(!delta)return;
  const nr=r+delta[0],nc=c+delta[1];if(nr<0||nr>=rows||nc<0||nc>=cols){bad();return}
  const next=nr*cols+nc,expected=parisPath[parisStep+1];
  if(next!==expected){bad();$("#paris-status").textContent="Sem pegadas nessa direção. Tente outra.";return}
  parisPos=next;parisStep++;tone(600,.05,.01);renderParis();$("#paris-status").textContent=parisStep===5?"Você encontrou a raposa.":"Boa. Continue seguindo as pegadas.";
  if(parisStep===5){good();$("#paris-objective").textContent="Entre na boutique";setTimeout(()=>go("boutique"),900)}
}
$$("[data-move]").forEach(b=>b.onclick=()=>moveParis(b.dataset.move));

/* BOUTIQUE — CINEMATIC HOTSPOTS */
const outfit={
  dress: document.querySelector('[data-look="dress-good"]')
};
const lookLabels={
  dress:"roupa",
  shoes:"sapato",
  jewel:"acessório",
  detail:"detalhe"
};
function updateBoutique(){
  const count=Object.keys(outfit).length;
  $("#look-status").textContent=`${count} / 4 peças`;
  $("#finish-look").disabled=count<4;
  const missing=["dress","shoes","jewel","detail"].filter(x=>!outfit[x]).map(x=>lookLabels[x]);
  $("#boutique-feedback").textContent=missing.length
    ? `Falta escolher: ${missing.join(", ")}.`
    : "Tudo escolhido. Confira o look e finalize.";
}
$$(".look-hotspot").forEach(btn=>{
  btn.onclick=()=>{
    const slot=btn.dataset.slot;
    $$(' .look-hotspot[data-slot="'+slot+'"]'.trim()).forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    outfit[slot]=btn;
    tone(530,.05,.01);
    updateBoutique();
  };
});
$("#finish-look").onclick=()=>{
  const chosen=Object.values(outfit);
  const wrong=chosen.filter(x=>x.dataset.good!=="true").length;
  if(wrong){
    bad();
    $("#boutique-feedback").textContent=wrong===1
      ? "Tem 1 escolha que não combina com o convite."
      : `Tem ${wrong} escolhas que não combinam com o convite.`;
    return;
  }
  good();
  $("#boutique-feedback").textContent="Perfeito. Esse é o look da noite.";
  setTimeout(()=>go("cafe"),900);
};
updateBoutique();

/* CAFE CONVEYOR */
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
function setupOrder(){
  const o=orders[orderIndex];$("#order-index").textContent=orderIndex+1;$("#order-title").textContent=o.title;$("#order-needed").innerHTML=o.need.map(x=>`<span>${foods[x].label}</span>`).join("");caught.clear();renderTray();$("#cafe-status").textContent="Pegue somente os itens do pedido.";startConveyor()
}
function renderTray(){$("#tray").innerHTML=[...caught].map(x=>`<span>${foods[x].label}</span>`).join("")}
function spawnFood(){
  const ids=Object.keys(foods),id=ids[Math.floor(Math.random()*ids.length)],el=document.createElement("button");el.className="conveyor-item";el.dataset.food=id;el.dataset.x=$("#conveyor").clientWidth+120;el.innerHTML=`<img src="${foods[id].img}" alt=""><b>${foods[id].label}</b>`;el.style.left=el.dataset.x+"px";el.onclick=()=>catchFood(el,id);$("#conveyor").appendChild(el);conveyorItems.push(el)
}
function catchFood(el,id){
  if(el.classList.contains("caught"))return;
  const o=orders[orderIndex];
  if(!o.need.includes(id)){bad();$("#cafe-status").textContent=id==="king"?"Esse queijo não.":"Esse item não está no pedido.";el.classList.add("caught");return}
  if(caught.has(id)){toast("Esse já está na bandeja.");el.classList.add("caught");return}
  caught.add(id);el.classList.add("caught");good();renderTray();$("#cafe-status").textContent=`${caught.size} de ${o.need.length} itens pegos.`;
  if(caught.size===o.need.length){stopConveyor();$("#cafe-status").textContent="Pedido completo!";orderIndex++;if(orderIndex>=orders.length)setTimeout(()=>go("witch"),850);else setTimeout(setupOrder,700)}
}
function conveyorLoop(){
  conveyorItems=[...conveyorItems].filter(el=>{let x=+el.dataset.x-2.2;el.dataset.x=x;el.style.left=x+"px";if(x<-130){el.remove();return false}return true});
  conveyorRaf=requestAnimationFrame(conveyorLoop)
}
function startConveyor(){stopConveyor();$("#conveyor").querySelectorAll(".conveyor-item").forEach(x=>x.remove());conveyorItems=[];spawnFood();conveyorTimer=setInterval(spawnFood,900);conveyorRaf=requestAnimationFrame(conveyorLoop)}
function stopConveyor(){clearInterval(conveyorTimer);cancelAnimationFrame(conveyorRaf);conveyorTimer=null;conveyorRaf=null}
setupOrder();

/* WITCH SIMON */
const ritualButtons=$$("#ritual-items button"),ritualIds=ritualButtons.map(x=>x.dataset.ritual);let ritualRound=1,sequence=[],input=[],showing=false;
function showSequence(){if(showing)return;sequence=Array.from({length:ritualRound+2},()=>ritualIds[Math.floor(Math.random()*ritualIds.length)]);input=[];showing=true;$("#show-ritual").disabled=true;$("#ritual-status").textContent="Observe a ordem.";let i=0;const step=()=>{if(i>=sequence.length){showing=false;$("#show-ritual").disabled=false;$("#ritual-status").textContent="Agora repita.";return}const b=$(`[data-ritual="${sequence[i]}"]`);b.classList.add("flash");tone(500+i*45,.07,.01);setTimeout(()=>{b.classList.remove("flash");i++;setTimeout(step,220)},470)};step()}
$("#show-ritual").onclick=showSequence;
ritualButtons.forEach(btn=>btn.onclick=()=>{if(showing||!sequence.length)return;btn.classList.add("flash");setTimeout(()=>btn.classList.remove("flash"),170);const pos=input.length;input.push(btn.dataset.ritual);if(input[pos]!==sequence[pos]){bad();sequence=[];input=[];$("#ritual-status").textContent="Errou. Clique em “Ver sequência” para tentar novamente.";return}tone(650+pos*35,.045,.009);if(input.length===sequence.length){good();if(ritualRound===3){$("#ritual-status").textContent="Ritual completo.";setTimeout(()=>go("journal"),850);return}ritualRound++;$("#ritual-round").textContent=`Rodada ${ritualRound} de 3`;sequence=[];input=[];$("#ritual-status").textContent="Certo. A próxima sequência será maior."}});

/* MEMORY PINS */
const iconBase="https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/";
const pairs=[{id:"paris",label:"Paris",icon:iconBase+"map-pin.svg"},{id:"home",label:"Apartamento",icon:iconBase+"home.svg"},{id:"flower",label:"Flores",icon:iconBase+"flower.svg"},{id:"love",label:"Romance",icon:iconBase+"heart.svg"}];
let cards=[...pairs,...pairs].map((x,i)=>({...x,uid:i})).sort(()=>Math.random()-.5),open=[],matches=0,lock=false;const grid=$("#memory-grid");
cards.forEach(card=>{const b=document.createElement("button");b.className="memory-card";b.dataset.pair=card.id;b.innerHTML=`<span class="memory-face memory-back"></span><span class="memory-face memory-front"><img src="${card.icon}" alt=""><b>${card.label}</b></span>`;b.onclick=()=>flipCard(b);grid.appendChild(b)});
function flipCard(card){if(lock||card.classList.contains("flipped")||card.classList.contains("matched"))return;card.classList.add("flipped");open.push(card);tone(480,.035,.007);if(open.length<2)return;lock=true;if(open[0].dataset.pair===open[1].dataset.pair){open.forEach(x=>x.classList.add("matched"));open=[];matches++;lock=false;good();$("#memory-progress").textContent=`${matches} / 4 pares`;if(matches===4)setTimeout(()=>go("finale"),900)}else setTimeout(()=>{open.forEach(x=>x.classList.remove("flipped"));open=[];lock=false;bad()},700)}
$("#replay").onclick=()=>location.reload();

document.addEventListener("keydown",e=>{
 const k=e.key.toLowerCase();
 if(current==="title"&&e.key==="Enter")$("#start-game").click();
 if(current==="paris"&&(k==="e"||e.key==="Enter")){if(dialogueOpen)advance();else if($("#paris-game").classList.contains("hidden"))openDialogue()}
 if(current==="paris"&&!$("#paris-game").classList.contains("hidden")){if(e.key==="ArrowUp")moveParis("up");if(e.key==="ArrowDown")moveParis("down");if(e.key==="ArrowLeft")moveParis("left");if(e.key==="ArrowRight")moveParis("right")}
});
snow("title-snow",90);snow("paris-snow",105);snow("final-snow",95);