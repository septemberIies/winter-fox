const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sceneOrder=["title","paris","boutique","cafe","witch","apartment","rhythm","drive","journal","finale"];
let current="title";

function showScene(id){
  sceneOrder.forEach(x=>document.getElementById(x)?.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  current=id;
}
function transitionTo(id,delay=420){
  const t=$("#transition"); t.classList.add("on");
  setTimeout(()=>{showScene(id);t.classList.remove("on");},delay);
}
function toast(msg,ms=1600){
  const el=$("#toast");el.textContent=msg;el.classList.remove("hidden");
  clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.add("hidden"),ms);
}
function makeSnow(id,count){
  const root=document.getElementById(id); if(!root)return;
  for(let i=0;i<count;i++){const f=document.createElement("i");f.className="snowflake";const size=Math.random()*2.4+.8,d=6+Math.random()*8,delay=-Math.random()*14,drift=Math.random()*120-60;f.style.cssText=`width:${size}px;height:${size}px;left:${Math.random()*100}%;opacity:${(.18+Math.random()*.55).toFixed(2)};--drift:${drift}px;animation:fall ${d}s linear ${delay}s infinite,sway ${d*.7}s ease-in-out ${delay}s infinite alternate`;root.appendChild(f);}
}
function audioTone(freq=420,d=.07,vol=.018,type="triangle"){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;window.__ctx??=new A();const c=window.__ctx;if(c.state==="suspended")c.resume();const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(vol,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+d+.02);}catch{}}
function successSound(){audioTone(620,.12,.025);setTimeout(()=>audioTone(880,.18,.018),70)}
function failSound(){audioTone(170,.09,.015,"sawtooth")}

/* TITLE */
$("#start").onclick=()=>{audioTone(330,.12,.02);transitionTo("paris")};

/* PARIS + PATH */
const parisLines=[
  "Você reconhece esse lugar, não reconhece?",
  "Paris fica diferente quando todo mundo vai embora e só sobra a neve.",
  "Eu escondi algumas coisas para você. Só preciso saber se ainda consegue me acompanhar.",
  "Observe minhas pegadas. Não pisque."
];
let parisLine=0,dialogueOpen=false,pathStep=0,pathReady=false;
const pathSeq=[2,0,1,2];

function openParisDialogue(){if(dialogueOpen||!$("#path-game").classList.contains("hidden"))return;dialogueOpen=true;parisLine=0;$("#fox-talk").classList.add("hidden");$("#paris-dialogue").classList.remove("hidden");$("#paris-line").textContent=parisLines[0];$("#paris-objective").textContent="Ouça a raposa";audioTone();}
function nextParisLine(){if(!dialogueOpen)return;parisLine++;audioTone(510,.04,.01);if(parisLine<parisLines.length){$("#paris-line").textContent=parisLines[parisLine];return;}dialogueOpen=false;$("#paris-dialogue").classList.add("hidden");$("#path-game").classList.remove("hidden");$("#paris-objective").textContent="Siga as pegadas";flashPath();}
function flashPath(){pathReady=false;$$(".path-lane").forEach(x=>x.classList.remove("flash"));setTimeout(()=>{const lane=$(`.path-lane[data-lane="${pathSeq[pathStep]}"]`);lane.classList.add("flash");audioTone(700+pathSeq[pathStep]*80,.09,.012);setTimeout(()=>{lane.classList.remove("flash");pathReady=true},850)},450);}
$("#fox-talk").onclick=openParisDialogue;$("#paris-fox").onclick=openParisDialogue;$("#paris-next").onclick=nextParisLine;
$$("[data-path]").forEach(btn=>btn.onclick=()=>{if(!pathReady)return;const pick=+btn.dataset.path;if(pick===pathSeq[pathStep]){pathStep++;successSound();$("#path-progress").textContent=`${pathStep} / 4`;$("#path-status").textContent="certo";if(pathStep===pathSeq.length){$("#paris-objective").textContent="Entre na boutique";$("#path-status").textContent="Você encontrou o caminho.";$("#paris-fox").classList.remove("idle");$("#paris-fox").classList.add("walk");setTimeout(()=>transitionTo("boutique"),1100);}else flashPath();}else{failSound();$("#path-status").textContent="ela não foi por aí";flashPath();}});

/* BOUTIQUE */
let selectedFashion=null;const outfit={};
$$(".fashion-item").forEach(item=>{
  item.addEventListener("dragstart",e=>{selectedFashion=item;e.dataTransfer.setData("text/plain",item.dataset.name)});
  item.onclick=()=>{$$(".fashion-item").forEach(x=>x.classList.remove("selected"));selectedFashion=item;item.classList.add("selected")};
});
$$(".outfit-slot").forEach(slot=>{
  slot.addEventListener("dragover",e=>e.preventDefault());
  slot.addEventListener("drop",e=>{e.preventDefault();placeFashion(slot)});
  slot.onclick=()=>placeFashion(slot);
});
function placeFashion(slot){if(!selectedFashion||selectedFashion.dataset.slot!==slot.dataset.slot){failSound();toast("Essa peça não vai nesse espaço.");return;}const old=outfit[slot.dataset.slot];if(old)old.classList.remove("used");outfit[slot.dataset.slot]=selectedFashion;selectedFashion.classList.add("used");slot.classList.add("filled");slot.innerHTML=`${selectedFashion.dataset.name}<span>selecionado</span>`;selectedFashion.classList.remove("selected");selectedFashion=null;audioTone(560,.06,.012)}
$("#check-look").onclick=()=>{if(Object.keys(outfit).length<4){failSound();$("#look-status").textContent="Ainda faltam peças.";return;}const ok=Object.values(outfit).every(x=>x.classList.contains("good"));if(!ok){failSound();$("#look-status").textContent="Bonito... mas não parece exatamente ela. Tente trocar alguma coisa.";return;}successSound();$("#look-status").textContent="Preto, vinho, renda, salto, laço. Agora sim.";setTimeout(()=>transitionTo("cafe"),1200)};

/* CAFE */
const orders=[
  {title:"Noite parisiense",text:"Algo suave para comer e alguma coisa bem gelada.",need:["brie","wine"]},
  {title:"Doce impossível de recusar",text:"Uma sobremesa que tenha Ninho, Nutella e um milkshake claro.",need:["pudding","milkshake"]},
  {title:"Fome de verdade",text:"Carne mal passada e alguma coisa quente do sushi.",need:["steak","sushi"]}
];
let orderIndex=0,tray=new Set(),orderTimer=null,timeLeft=100;
function renderOrder(){const o=orders[orderIndex];$("#order-number").textContent=orderIndex+1;$("#order-title").textContent=o.title;$("#order-text").textContent=o.text;tray.clear();renderTray();$$("[data-food]").forEach(x=>x.classList.remove("selected"));$("#order-status").textContent="";timeLeft=100;$("#order-timer").style.width="100%";clearInterval(orderTimer);orderTimer=setInterval(()=>{timeLeft-=1.15;$("#order-timer").style.width=Math.max(0,timeLeft)+"%";if(timeLeft<=0){clearInterval(orderTimer);failSound();$("#order-status").textContent="O pedido esfriou. Tenta de novo.";setTimeout(renderOrder,850)}},100);}
function renderTray(){$("#tray").innerHTML=[...tray].map(id=>{const el=$(`[data-food="${id}"] span`);return `<span>${el?.textContent||id}</span>`}).join("")}
$$("[data-food]").forEach(btn=>btn.onclick=()=>{const id=btn.dataset.food;if(tray.has(id)){tray.delete(id);btn.classList.remove("selected")}else{if(tray.size>=3){toast("A bandeja já está cheia.");return;}tray.add(id);btn.classList.add("selected");audioTone(420,.04,.008)}renderTray()});
$("#serve-order").onclick=()=>{const o=orders[orderIndex],chosen=[...tray].sort().join(","),need=[...o.need].sort().join(",");if(chosen!==need){failSound();$("#order-status").textContent=tray.has("king")?"Queijo do reino? Definitivamente não.":"Esse não é o pedido.";return;}clearInterval(orderTimer);successSound();$("#order-status").textContent="Perfeito.";orderIndex++;if(orderIndex>=orders.length){setTimeout(()=>transitionTo("witch"),900)}else setTimeout(renderOrder,650)};
renderOrder();

/* WITCH MEMORY */
const ingButtons=$$("#ingredient-grid button"),ings=ingButtons.map(x=>x.dataset.ing);let ritualRound=1,ritualSeq=[],ritualInput=[],ritualShowing=false;
function newRitual(){ritualSeq=Array.from({length:ritualRound+2},()=>ings[Math.floor(Math.random()*ings.length)]);ritualInput=[];$("#ritual-status").textContent="Observe...";ritualShowing=true;let i=0;const step=()=>{if(i>=ritualSeq.length){ritualShowing=false;$("#ritual-status").textContent="Agora repita.";return;}const b=$(`[data-ing="${ritualSeq[i]}"]`);b.classList.add("flash");audioTone(500+i*55,.08,.012);setTimeout(()=>{b.classList.remove("flash");i++;setTimeout(step,210)},480)};step()}
$("#start-ritual").onclick=()=>{if(!ritualShowing)newRitual()};
ingButtons.forEach(b=>b.onclick=()=>{if(ritualShowing||!ritualSeq.length)return;const id=b.dataset.ing;ritualInput.push(id);b.classList.add("flash");setTimeout(()=>b.classList.remove("flash"),180);const pos=ritualInput.length-1;if(id!==ritualSeq[pos]){failSound();$("#ritual-status").textContent="A poção apagou. Veja a sequência de novo.";ritualSeq=[];ritualInput=[];return;}audioTone(640+pos*40,.05,.01);if(ritualInput.length===ritualSeq.length){successSound();if(ritualRound===3){$("#ritual-status").textContent="O ritual abriu a próxima porta.";setTimeout(()=>transitionTo("apartment"),950)}else{ritualRound++;$("#ritual-round").textContent=ritualRound;ritualSeq=[];$("#ritual-status").textContent="Certo. A próxima sequência é maior.";}}});

/* HIDDEN OBJECTS */
let found=0;
$$(".hidden-object").forEach(obj=>obj.onclick=()=>{if(obj.classList.contains("found"))return;obj.classList.add("found");found++;audioTone(610,.06,.012);const label=$(`[data-label="${obj.dataset.find}"]`);label?.classList.add("done");$("#find-status").textContent=`${found} / 5 encontrados`;if(found===5){successSound();$("#find-status").textContent="Tudo no lugar.";setTimeout(()=>transitionTo("rhythm"),1000)}});

/* RHYTHM */
const rhythmBoard=$("#rhythm-board"),laneKeys=["a","s","d","f"];let rhythmRunning=false,notes=[],rhythmScore=0,rhythmCombo=0,rhythmSpawned=0,rhythmStartTime=0,spawnTimer=null,raf=null;
function spawnNote(){const lane=Math.floor(Math.random()*4),el=document.createElement("i");el.className="note";el.dataset.lane=lane;el.style.left=`calc(${lane*25}% + 9px)`;el.dataset.y="-26";rhythmBoard.appendChild(el);notes.push(el);rhythmSpawned++;}
function hitLane(lane){if(!rhythmRunning)return;const candidates=notes.filter(n=>+n.dataset.lane===lane);if(!candidates.length){rhythmCombo=0;$("#rhythm-combo").textContent=0;failSound();return;}let best=candidates.sort((a,b)=>Math.abs(+a.dataset.y-382)-Math.abs(+b.dataset.y-382))[0],y=+best.dataset.y;if(y>335&&y<425){rhythmScore++;rhythmCombo++;best.remove();notes=notes.filter(n=>n!==best);audioTone(440+lane*90,.045,.01);$("#rhythm-score").textContent=rhythmScore;$("#rhythm-combo").textContent=rhythmCombo;}else{rhythmCombo=0;$("#rhythm-combo").textContent=0;failSound();}}
function rhythmLoop(ts){if(!rhythmRunning)return;if(!rhythmStartTime)rhythmStartTime=ts;notes.forEach(n=>{const y=+n.dataset.y+4.1;n.dataset.y=y;n.style.transform=`translateY(${y}px)`;if(y>460){n.remove();notes=notes.filter(x=>x!==n);rhythmCombo=0;$("#rhythm-combo").textContent=0;}});if(rhythmSpawned>=22&&!notes.length){finishRhythm();return;}raf=requestAnimationFrame(rhythmLoop)}
function startRhythm(){if(rhythmRunning)return;rhythmRunning=true;rhythmScore=0;rhythmCombo=0;rhythmSpawned=0;notes.forEach(n=>n.remove());notes=[];$("#rhythm-score").textContent=0;$("#rhythm-combo").textContent=0;$("#rhythm-status").textContent="";$("#start-rhythm").disabled=true;spawnNote();spawnTimer=setInterval(()=>{if(rhythmSpawned<22)spawnNote();else clearInterval(spawnTimer)},620);rhythmStartTime=0;raf=requestAnimationFrame(rhythmLoop)}
function finishRhythm(){rhythmRunning=false;clearInterval(spawnTimer);cancelAnimationFrame(raf);$("#start-rhythm").disabled=false;if(rhythmScore>=11){successSound();$("#rhythm-status").textContent=`${rhythmScore}/22 — passou.`;setTimeout(()=>transitionTo("drive"),950)}else{failSound();$("#rhythm-status").textContent=`${rhythmScore}/22. Precisa de 11. Tenta mais uma vez.`;}}
$("#start-rhythm").onclick=startRhythm;$$(".lane").forEach((l,i)=>l.onclick=()=>hitLane(i));

/* DRIVE */
const road=$("#road"),car=$("#car");let carLane=1,driveRunning=false,driveItems=[],driveRoses=0,driveHearts=3,driveSpawn=null,driveRaf=null;
function setCarLane(){car.style.left=["28%","50%","72%"][carLane]}
function moveCar(dir){if(!driveRunning)return;carLane=Math.max(0,Math.min(2,carLane+dir));setCarLane();audioTone(250+carLane*50,.035,.006)}
function spawnDriveItem(){if(!driveRunning)return;const isRose=Math.random()<.58,el=document.createElement("i");el.className="drive-item "+(isRose?"rose":"barrier");el.dataset.kind=isRose?"rose":"barrier";el.dataset.lane=Math.floor(Math.random()*3);el.dataset.y="-45";el.style.left=["28%","50%","72%"][+el.dataset.lane];el.textContent=isRose?"🌹":"";road.appendChild(el);driveItems.push(el)}
function driveLoop(){if(!driveRunning)return;driveItems.forEach(el=>{let y=+el.dataset.y+5.1;el.dataset.y=y;el.style.top=y+"px";if(y>road.clientHeight-150&&y<road.clientHeight-35&&+el.dataset.lane===carLane&&!el.dataset.hit){el.dataset.hit="1";if(el.dataset.kind==="rose"){driveRoses++;$("#rose-count").textContent=driveRoses;successSound();el.remove();driveItems=driveItems.filter(x=>x!==el);if(driveRoses>=6){finishDrive(true);return}}else{driveHearts--;$("#drive-hearts").textContent=driveHearts;failSound();el.remove();driveItems=driveItems.filter(x=>x!==el);if(driveHearts<=0){finishDrive(false);return}}}else if(y>road.clientHeight+40){el.remove();driveItems=driveItems.filter(x=>x!==el)}});driveRaf=requestAnimationFrame(driveLoop)}
function startDrive(){if(driveRunning)return;driveRunning=true;driveRoses=0;driveHearts=3;carLane=1;setCarLane();$("#rose-count").textContent=0;$("#drive-hearts").textContent=3;$("#drive-status").textContent="";$("#start-drive").disabled=true;driveItems.forEach(x=>x.remove());driveItems=[];spawnDriveItem();driveSpawn=setInterval(spawnDriveItem,650);driveRaf=requestAnimationFrame(driveLoop)}
function finishDrive(win){driveRunning=false;clearInterval(driveSpawn);cancelAnimationFrame(driveRaf);$("#start-drive").disabled=false;driveItems.forEach(x=>x.remove());driveItems=[];if(win){successSound();$("#drive-status").textContent="Seis rosas. Chegamos.";setTimeout(()=>transitionTo("journal"),900)}else{$("#drive-status").textContent="A neve ganhou essa. Tenta de novo.";}}
$("#start-drive").onclick=startDrive;

/* JOURNAL */
const future={};
$$("[data-future]").forEach(b=>b.onclick=()=>{const type=b.dataset.future;$$(`[data-future="${type}"]`).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");future[type]=b.dataset.value;const slot=$(`[data-future-slot="${type}"]`);slot.classList.add("filled");slot.innerHTML=future[type];audioTone(560,.05,.009);$("#finish-journal").disabled=Object.keys(future).length<4});
$("#finish-journal").onclick=()=>{successSound();transitionTo("finale")};
$("#replay").onclick=()=>location.reload();

/* KEYS */
document.addEventListener("keydown",e=>{
  const k=e.key.toLowerCase();
  if(current==="title"&&e.key==="Enter")$("#start").click();
  if(current==="paris"&&(k==="e"||e.key==="Enter")){if(dialogueOpen)nextParisLine();else if($("#path-game").classList.contains("hidden"))openParisDialogue()}
  if(current==="rhythm"&&laneKeys.includes(k))hitLane(laneKeys.indexOf(k));
  if(current==="drive"){if(k==="a"||e.key==="ArrowLeft")moveCar(-1);if(k==="d"||e.key==="ArrowRight")moveCar(1)}
});

makeSnow("title-snow",90);makeSnow("paris-snow",110);makeSnow("cafe-snow",30);makeSnow("drive-snow",85);makeSnow("final-snow",100);
