const scenes = {
  title: document.getElementById("title-screen"),
  paris: document.getElementById("paris-scene"),
  cheese: document.getElementById("cheese-scene")
};

const startButton = document.getElementById("start-button");
const fox = document.getElementById("story-fox");
const foxWrap = document.getElementById("fox-wrap");
const foxPrompt = document.getElementById("fox-prompt");
const dialogue = document.getElementById("story-dialogue");
const dialogueText = document.getElementById("story-dialogue-text");
const dialogueNext = document.getElementById("dialogue-next");
const objective = document.getElementById("story-objective");
const transition = document.getElementById("scene-transition");
const feedback = document.getElementById("puzzle-feedback");

let dialogueOpen = false;
let dialogueIndex = 0;
let parisFinished = false;

const foxLines = [
  "Você reconhece esse lugar, não reconhece?",
  "Paris fica diferente quando todo mundo vai embora e só sobra a neve.",
  "Eu escondi uma coisa pra você. Mas primeiro preciso saber se ainda consegue me acompanhar.",
  "Venha. E não confie em tudo que parece óbvio."
];

function showScene(name) {
  Object.values(scenes).forEach(scene => scene.classList.remove("is-active"));
  scenes[name].classList.add("is-active");
}

function makeSnow(containerId, count, slow = false) {
  const root = document.getElementById(containerId);
  if (!root) return;

  for (let i = 0; i < count; i++) {
    const flake = document.createElement("span");
    flake.className = "snowflake";

    const size = Math.random() * 2.5 + .8;
    const duration = (slow ? 9 : 6) + Math.random() * 8;
    const delay = Math.random() * -14;
    const drift = Math.random() * 120 - 60;

    flake.style.width = size + "px";
    flake.style.height = size + "px";
    flake.style.left = Math.random() * 100 + "%";
    flake.style.opacity = (Math.random() * .55 + .18).toFixed(2);
    flake.style.animation =
      `fall ${duration}s linear ${delay}s infinite, drift ${duration * .72}s ease-in-out ${delay}s infinite alternate`;
    flake.style.setProperty("--drift", drift + "px");

    root.appendChild(flake);
  }
}

function pulse(element) {
  element.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.045)" },
      { transform: "scale(1)" }
    ],
    { duration: 220, easing: "ease-out" }
  );
}

function tone(freq = 330, duration = .08, volume = .025) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    window.__winterCtx ||= new AudioCtx();
    const ctx = window.__winterCtx;

    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + .02);
  } catch {}
}

function openFoxDialogue() {
  if (parisFinished || dialogueOpen) return;

  dialogueIndex = 0;
  dialogueOpen = true;
  foxPrompt.classList.add("hidden");
  dialogue.classList.remove("hidden");
  dialogueText.textContent = foxLines[0];
  objective.textContent = "Ouça a raposa";
  tone(420, .08, .018);
}

function advanceDialogue() {
  if (!dialogueOpen) return;

  dialogueIndex += 1;
  tone(510, .04, .012);

  if (dialogueIndex < foxLines.length) {
    dialogueText.textContent = foxLines[dialogueIndex];
    return;
  }

  dialogueOpen = false;
  parisFinished = true;
  dialogue.classList.add("hidden");
  objective.textContent = "Siga a raposa";

  fox.classList.remove("idle");
  fox.classList.add("walk");
  foxWrap.classList.add("fox-destination");

  setTimeout(() => {
    fox.classList.remove("walk");
    fox.classList.add("idle");
    objective.textContent = "Entre no café";
  }, 2800);

  setTimeout(() => {
    transition.classList.add("on");

    setTimeout(() => {
      showScene("cheese");
      transition.classList.remove("on");
    }, 520);
  }, 3900);
}

startButton.addEventListener("click", () => {
  tone(330, .12, .025);
  transition.classList.add("on");

  setTimeout(() => {
    showScene("paris");
    transition.classList.remove("on");
  }, 500);
});

fox.addEventListener("click", openFoxDialogue);
foxPrompt.addEventListener("click", openFoxDialogue);
dialogueNext.addEventListener("click", advanceDialogue);

fox.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key.toLowerCase() === "e") {
    openFoxDialogue();
  }
});

document.addEventListener("keydown", event => {
  if (event.key.toLowerCase() !== "e" && event.key !== "Enter") return;

  if (scenes.title.classList.contains("is-active") && event.key === "Enter") {
    startButton.click();
    return;
  }

  if (scenes.paris.classList.contains("is-active")) {
    if (dialogueOpen) advanceDialogue();
    else if (!parisFinished) openFoxDialogue();
  }
});

document.querySelectorAll(".cheese-option").forEach(button => {
  button.addEventListener("click", () => {
    pulse(button);

    if (button.dataset.cheese === "brie") {
      tone(650, .16, .022);
      feedback.textContent = "Certo. A raposa parece satisfeita. O inverno ficou um pouco menos frio.";
      button.style.borderColor = "rgba(207,165,103,.7)";
      button.style.background = "rgba(75,55,37,.6)";

      document.querySelectorAll(".cheese-option").forEach(option => {
        option.disabled = true;
        if (option !== button) option.style.opacity = ".38";
      });
    } else {
      tone(180, .09, .014);
      feedback.textContent = "Não parece ser esse. A raposa olha para você e espera outra escolha.";
    }
  });
});

const style = document.createElement("style");
style.textContent = `
@keyframes fall {
  from { transform: translate3d(0,-12px,0); }
  to { transform: translate3d(var(--drift),110vh,0); }
}
@keyframes drift {
  from { margin-left: -10px; }
  to { margin-left: 10px; }
}
`;
document.head.appendChild(style);

makeSnow("title-snow", 90, true);
makeSnow("paris-snow", 105, false);
makeSnow("cafe-snow", 34, true);
