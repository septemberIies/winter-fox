const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const scenes=["title","paris","boutique","cafe","witch","journal","finale"];
let current="title";

function show(id){scenes.forEach(x=>document.getElementById(x)?.classList.remove("active"));document.getElementById(id)?.classList.add("active");current=id;}
function go(id){const t=$("#transition");t.classList.add("on");setTimeout(()=>{show(id);t.classList.remove("on");},360);}
function toast(msg){const e=$("#toast");e.textContent=msg;e.classList.remove("hidden");clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.add("hidden"),1400);}
function tone(f=440,d=.06,v=.014){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;window.__audio??=new A();const c=window.__audio;if(c.state==="suspended")c.resume();const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(v,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+d+.02);}catch{}}
function good(){tone(620,.11,.022);setTimeout(()=>tone(850,.14,.015),65)}
function bad(){tone(175,.08,.013)}
function snow(id,n){const root=document.getElementById(id);if(!root)return;for(let i=0;i<n;i++){const f=document.createElement("i");f.className="snowflake";const s=.8+Math.random()*2.3,d=7+Math.random()*8,dr=-55+Math.random()*110;f.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;opacity:${(.16+Math.random()*.5).toFixed(2)};--drift:${dr}px;animation:fall ${d}s linear ${-Math.random()*12}s infinite,sway ${d*.7}s ease-in-out infinite alternate`;root.appendChild(f);}}

/* START */
$("#start-game").onclick=()=>{tone(330,.12,.02);go("paris")};

/* PARIS */
const lines=[
  "Paris parece mais bonita quando está fria, não acha?",
  "Eu preparei algumas coisas que têm a sua cara.",
  "Primeiro, presta atenção nas minhas pegadas."
];
let line=0,dialogueOpen=false,pawRound=0,pawReady=false,pawAnswer=0;
function openDialogue(){if(dialogueOpen||!$("#paw-game").classList.contains("hidden"))return;dialogueOpen=true;line=0;$("#talk-fox").classList.add("hidden");$("#dialogue").classList.remove("hidden");$("#dialogue-text").textContent=lines[0];$("#paris-objective").textContent="Ouça a raposa";tone();}
function advance(){if(!dialogueOpen)return;line++;tone(510,.04,.01);if(line<lines.length){$("#dialogue-text").textContent=lines[line];return;}dialogueOpen=false;$("#dialogue").classList.add("hidden");$("#paw-game").classList.remove("hidden");$("#paris-objective").textContent="Siga as pegadas";nextPaw();}
$("#talk-fox").onclick=openDialogue;$("#fox").onclick=openDialogue;$("#dialogue-next").onclick=advance;

function nextPaw(){
  pawReady=false;
  $("#paw-round").textContent=`Rodada ${pawRound+1} de 4`;
  $("#paw-status").textContent="Observe.";
  $$(".paw-road").forEach(x=>x.classList.remove("flash"));
  pawAnswer=Math.floor(Math.random()*3);
  setTimeout(()=>{
    const road=$(`.paw-road[data-road="${pawAnswer}"]`);
    road.classList.add("flash");tone(700+pawAnswer*70,.09,.011);
    setTimeout(()=>{road.classList.remove("flash");pawReady=true;$("#paw-status").textContent="Agora escolha.";},820);
  },420);
}
$$(".paw-road").forEach(btn=>btn.onclick=()=>{
  if(!pawReady)return;
  pawReady=false;
  if(+btn.dataset.road!==pawAnswer){bad();$("#paw-status").textContent="Não foi por aí. Veja de novo.";setTimeout(nextPaw,700);return;}
  pawRound++;good();
  if(pawRound>=4){$("#paw-status").textContent="Você alcançou a raposa.";$("#paris-objective").textContent="Entre na boutique";$("#fox").classList.remove("idle");$("#fox").classList.add("walk");setTimeout(()=>go("boutique"),1000);return;}
  $("#paw-status").textContent="Certo.";setTimeout(nextPaw,650);
});

/* BOUTIQUE */
const look={};
$$("[data-choice]").forEach(btn=>btn.onclick=()=>{
  const cat=btn.dataset.choice;
  $$(`[data-choice="${cat}"]`).forEach(x=>x.classList.remove("selected"));
  btn.classList.add("selected");look[cat]=btn;
  const count=Object.keys(look).length;$("#look-status").textContent=`${count} de 4 escolhidos`;$("#confirm-look").disabled=count<4;tone(520,.045,.009);
});
$("#confirm-look").onclick=()=>{
  const wrong=Object.values(look).filter(x=>x.dataset.good!=="true").length;
  if(wrong){bad();$("#look-status").textContent=wrong===1?"Tem 1 peça que não combina com o convite.":`Tem ${wrong} peças que não combinam com o convite.`;return;}
  good();$("#look-status").textContent="Perfeito para a noite.";setTimeout(()=>go("cafe"),850);
};

/* CAFE */
const orders=[
  {title:"Frio em Paris",hint:"O pedido quer exatamente estas duas coisas:",need:["brie","wine"],labels:["Brie","Vinho gelado"]},
  {title:"Sobremesa",hint:"Agora, duas coisas doces:",need:["pudding","shake"],labels:["Pudim Ninho + Nutella","Milkshake de baunilha"]},
  {title:"Mesa dela",hint:"Último pedido: junte os quatro favoritos desta noite.",need:["brie","wine","pudding","shake"],labels:["Brie","Vinho gelado","Pudim","Milkshake"]}
];
let order=0,selectedFood=new Set();
function renderOrder(){
  const o=orders[order];$("#order-index").textContent=order+1;$("#order-title").textContent=o.title;$("#order-hint").textContent=o.hint;
  $("#order-needed").innerHTML=o.labels.map(x=>`<span>${x}</span>`).join("");
  selectedFood.clear();$$(".food-item").forEach(x=>x.classList.remove("selected"));$("#selected-count").textContent="0";$("#order-status").textContent="";
}
$$(".food-item").forEach(btn=>btn.onclick=()=>{
  const id=btn.dataset.food;
  if(selectedFood.has(id)){selectedFood.delete(id);btn.classList.remove("selected")}else{selectedFood.add(id);btn.classList.add("selected");tone(470,.04,.008)}
  $("#selected-count").textContent=selectedFood.size;
});
$("#serve").onclick=()=>{
  const need=[...orders[order].need].sort().join("|"),got=[...selectedFood].sort().join("|");
  if(need!==got){bad();$("#order-status").textContent=selectedFood.has("king")?"Queijo do reino não entra nessa mesa.":"Confira o pedido acima e tente de novo.";return;}
  good();$("#order-status").textContent="Pedido certo.";order++;
  if(order>=orders.length){setTimeout(()=>go("witch"),800)}else setTimeout(renderOrder,600);
};
renderOrder();

/* WITCH */
const ritualButtons=$$("#ritual-items button"),ritualIds=ritualButtons.map(x=>x.dataset.ritual);
let ritualRound=1,sequence=[],input=[],showing=false;
function buildSequence(){sequence=Array.from({length:ritualRound+2},()=>ritualIds[Math.floor(Math.random()*ritualIds.length)]);input=[];}
function showSequence(){
  if(showing)return;buildSequence();showing=true;$("#show-ritual").disabled=true;$("#ritual-status").textContent="Observe.";let i=0;
  const step=()=>{if(i>=sequence.length){showing=false;$("#show-ritual").disabled=false;$("#ritual-status").textContent="Sua vez.";return;}
    const b=$(`[data-ritual="${sequence[i]}"]`);b.classList.add("flash");tone(500+i*45,.07,.01);setTimeout(()=>{b.classList.remove("flash");i++;setTimeout(step,220)},470);
  };step();
}
$("#show-ritual").onclick=showSequence;
ritualButtons.forEach(btn=>btn.onclick=()=>{
  if(showing||!sequence.length)return;
  btn.classList.add("flash");setTimeout(()=>btn.classList.remove("flash"),170);
  const pos=input.length;input.push(btn.dataset.ritual);
  if(input[pos]!==sequence[pos]){bad();sequence=[];input=[];$("#ritual-status").textContent="Errou a ordem. Clique em “Ver sequência” para tentar de novo.";return;}
  tone(650+pos*35,.045,.009);
  if(input.length===sequence.length){
    good();
    if(ritualRound===3){$("#ritual-status").textContent="Ritual completo.";setTimeout(()=>go("journal"),850);return;}
    ritualRound++;$("#ritual-round").textContent=`Rodada ${ritualRound} de 3`;sequence=[];input=[];$("#ritual-status").textContent="Certo. A próxima é um pouco maior.";
  }
});

/* MEMORY */
const iconBase="https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/";
const pairs=[
  {id:"paris",label:"Paris",icon:iconBase+"map-pin.svg"},
  {id:"home",label:"Apartamento",icon:iconBase+"home.svg"},
  {id:"flower",label:"Flores",icon:iconBase+"flower.svg"},
  {id:"love",label:"Romance",icon:iconBase+"heart.svg"}
];
let cards=[...pairs,...pairs].map((x,i)=>({...x,uid:i})).sort(()=>Math.random()-.5),open=[],matches=0,lock=false;
const grid=$("#memory-grid");
cards.forEach(card=>{
  const b=document.createElement("button");b.className="memory-card";b.dataset.pair=card.id;b.innerHTML=`<span class="memory-face memory-back"></span><span class="memory-face memory-front"><img src="${card.icon}" alt=""><b>${card.label}</b></span>`;
  b.onclick=()=>flipCard(b);grid.appendChild(b);
});
function flipCard(card){
  if(lock||card.classList.contains("flipped")||card.classList.contains("matched"))return;
  card.classList.add("flipped");open.push(card);tone(480,.035,.007);
  if(open.length<2)return;
  lock=true;
  if(open[0].dataset.pair===open[1].dataset.pair){
    open.forEach(x=>x.classList.add("matched"));open=[];matches++;lock=false;good();$("#memory-progress").textContent=`${matches} de 4 pares`;
    if(matches===4)setTimeout(()=>go("finale"),900);
  }else{
    setTimeout(()=>{open.forEach(x=>x.classList.remove("flipped"));open=[];lock=false;bad();},700);
  }
}

/* final */
$("#replay").onclick=()=>location.reload();

document.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  if(current==="title"&&e.key==="Enter")$("#start-game").click();
  if(current==="paris"&&(k==="e"||e.key==="Enter")){if(dialogueOpen)advance();else if($("#paw-game").classList.contains("hidden"))openDialogue();}
});

snow("title-snow",90);snow("paris-snow",105);snow("final-snow",95);
