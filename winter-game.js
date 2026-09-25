const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const TILE = 16;
const TILE_SCALE = 3;
const BASE_WORLD_COLS = 31;
const BASE_WORLD_ROWS = 18;
const WORLD_COLS = 52;
const WORLD_ROWS = 34;
const WORLD_WIDTH = WORLD_COLS * TILE * TILE_SCALE;
const WORLD_HEIGHT = WORLD_ROWS * TILE * TILE_SCALE;
const BASE_WORLD_WIDTH = BASE_WORLD_COLS * TILE * TILE_SCALE;
const BASE_WORLD_HEIGHT = BASE_WORLD_ROWS * TILE * TILE_SCALE;

const ASSETS = {
  winterTiles: "https://raw.githubusercontent.com/Tiddybub/2d-assets/main/misc/tiny-ski/Tilemap/tilemap_packed.png",
  girl: "https://raw.githubusercontent.com/Tiddybub/2d-assets/main/characters/oga-miss-princess-animated-16x16/missprincess.png",
  foxIdle: "https://raw.githubusercontent.com/dowoonlee/ai-service-usage/main/Sources/ClaudeUsage/Resources/wild-animals/Fox/Fox_Idle.png",
  foxWalk: "https://raw.githubusercontent.com/dowoonlee/ai-service-usage/main/Sources/ClaudeUsage/Resources/wild-animals/Fox/Fox_Walk.png",
  foxRun: "https://raw.githubusercontent.com/dowoonlee/ai-service-usage/main/Sources/ClaudeUsage/Resources/wild-animals/Fox/Fox_Run.png"
};

const ui = {
  title: document.querySelector("#title-screen"),
  start: document.querySelector("#start-button"),
  hud: document.querySelector("#hud"),
  area: document.querySelector("#area-name"),
  objective: document.querySelector("#objective-text"),
  prompt: document.querySelector("#interaction"),
  promptText: document.querySelector("#interaction-text"),
  dialogue: document.querySelector("#dialogue"),
  speaker: document.querySelector("#dialogue-speaker"),
  text: document.querySelector("#dialogue-text"),
  controls: document.querySelector("#controls"),
  loading: document.querySelector("#loading")
};

function hide(el) { el.classList.add("hidden"); }
function show(el) { el.classList.remove("hidden"); }

const TERRAIN = [
  3,3,4,3,3,3,3,5,1,1,1,1,2,3,3,3,5,1,1,1,1,1,1,1,6,2,3,3,3,3,3,
  3,4,3,3,3,3,3,5,6,1,1,1,2,4,3,3,5,1,1,1,1,1,1,6,1,2,4,3,3,3,3,
  3,3,3,3,3,4,3,5,1,6,1,1,2,3,3,3,5,1,1,1,1,1,1,1,1,2,3,3,3,3,3,
  3,3,3,3,3,3,4,5,1,1,1,1,2,3,3,3,5,1,1,1,1,6,1,1,1,2,3,4,3,3,3,
  4,3,3,3,3,3,77,78,1,6,1,1,2,3,3,3,16,1,1,1,1,1,1,1,1,2,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,1,2,3,3,4,3,29,1,1,1,1,1,1,1,2,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,1,2,3,3,3,3,3,18,1,1,1,1,1,1,2,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,1,2,3,3,3,3,3,5,1,1,1,1,1,61,62,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,14,15,3,3,3,3,3,5,1,1,1,1,1,2,3,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,13,27,3,3,3,3,3,5,1,1,1,1,1,2,3,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,2,3,3,3,3,3,3,5,1,1,1,1,1,2,3,3,3,3,3,3,
  3,3,3,3,3,3,5,1,1,1,1,2,3,63,64,3,3,40,30,1,1,1,1,1,2,3,3,3,3,4,3,
  3,3,3,3,3,3,5,1,1,1,1,25,39,3,3,3,40,41,53,1,1,1,1,1,2,4,3,3,3,3,3,
  3,3,3,3,3,4,5,1,1,1,1,50,51,3,3,37,52,53,1,1,1,1,1,1,2,3,4,3,3,3,3,
  3,4,3,3,3,3,16,17,1,1,1,1,2,3,3,3,5,1,1,1,1,1,1,1,2,3,3,3,3,3,3,
  3,3,3,3,4,3,28,29,17,1,6,1,2,3,3,3,65,66,1,1,1,6,1,14,15,3,3,3,3,3,4,
  3,3,3,3,3,4,3,28,29,17,1,1,2,3,3,4,3,5,1,1,1,1,6,13,27,3,3,3,3,3,3,
  3,3,3,3,3,3,3,3,28,18,1,1,2,3,4,3,3,5,1,1,1,1,1,2,3,3,3,4,3,3,3
];

const OBJECTS = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,7,0,0,0,
  31,0,0,0,7,0,31,0,0,0,0,22,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,19,7,31,0,
  0,0,7,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,31,0,0,0,0,0,0,0,19,0,0,
  0,0,19,0,0,0,0,0,0,0,22,0,0,0,80,0,0,0,7,0,0,0,8,0,0,0,0,0,0,0,7,
  0,0,0,31,0,0,0,0,8,0,0,0,0,0,60,0,0,0,19,7,0,0,20,0,0,0,0,0,0,0,19,
  0,23,24,0,0,0,0,0,20,0,0,22,0,0,71,0,0,0,0,19,32,0,0,0,82,0,0,0,31,0,0,
  0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,60,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,7,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,7,0,19,0,0,0,0,0,19,7,0,0,0,0,0,0,0,31,0,7,31,32,0,0,0,0,35,36,0,0,
  0,19,7,0,0,0,0,0,0,0,19,0,0,0,0,0,0,11,0,0,19,0,0,70,0,0,0,0,0,0,31,
  0,0,19,0,0,0,0,0,31,0,0,34,0,0,0,0,0,11,0,8,0,0,0,0,0,0,7,0,31,0,0,
  0,0,0,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,20,0,0,0,0,0,0,19,7,0,31,0,
  0,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,19,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,31,0,0,0,0,0
];

class BootScene extends Phaser.Scene {
  constructor() { super("boot"); }

  preload() {
    this.load.spritesheet("winter", ASSETS.winterTiles, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("girl", ASSETS.girl, {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("fox-public-idle", ASSETS.foxIdle, {
      frameWidth: 64,
      frameHeight: 36
    });
    this.load.spritesheet("fox-public-walk", ASSETS.foxWalk, {
      frameWidth: 64,
      frameHeight: 36
    });
    this.load.spritesheet("fox-public-run", ASSETS.foxRun, {
      frameWidth: 64,
      frameHeight: 36
    });

    this.load.on("loaderror", file => {
      console.warn("Asset não carregou:", file.key);
    });
  }

  create() {
    this.makeFallbackTextures();

    for (const key of [
      "winter",
      "girl",
      "fox-public-idle",
      "fox-public-walk",
      "fox-public-run"
    ]) {
      if (this.textures.exists(key)) {
        this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    }

    hide(ui.loading);
    this.scene.start("title");
  }

  makeFallbackTextures() {
    const g = this.make.graphics({ add: false });

    const skin = 0xf2d3bd;
    const skinShadow = 0xdcae93;
    const hair = 0x0b0c0f;
    const hairSoft = 0x15171b;
    const eye = 0x6b4935;
    const lash = 0x111216;
    const lip = 0xb86f78;
    const cheek = 0xe8b7ad;
    const dress = 0x6b2035;
    const dressLight = 0x8b314b;
    const dressDark = 0x471522;
    const shoe = 0x1c1f25;

    const drawHero = (key, dir, step = 0) => {
      g.clear();

      // shadow under feet baked into sprite
      g.fillStyle(0x000000, 0.10);
      g.fillEllipse(12, 22, 10, 3);

      if (dir === "down") {
        // Black hair: cleaner silhouette, no grey blocks.
        g.fillStyle(hair);
        g.fillRect(7, 1, 10, 2);
        g.fillRect(6, 2, 12, 4);
        g.fillRect(5, 5, 2, 8);
        g.fillRect(17, 5, 2, 8);

        // Face.
        g.fillStyle(skin);
        g.fillRect(7, 5, 10, 7);

        // Soft fringe, using near-black only.
        g.fillStyle(hair);
        g.fillRect(7, 4, 3, 2);
        g.fillRect(14, 4, 3, 2);
        g.fillRect(10, 4, 4, 1);
        g.fillStyle(hairSoft);
        g.fillRect(8, 3, 2, 1);
        g.fillRect(14, 3, 2, 1);

        // Delicate brown eyes + tiny lashes.
        g.fillStyle(lash);
        g.fillRect(8, 7, 1, 1);
        g.fillRect(15, 7, 1, 1);
        g.fillStyle(eye);
        g.fillRect(9, 7, 1, 1);
        g.fillRect(14, 7, 1, 1);

        // Subtle cheeks.
        g.fillStyle(cheek);
        g.fillRect(8, 9, 1, 1);
        g.fillRect(15, 9, 1, 1);

        // Small rose mouth — no dark line under the face.
        g.fillStyle(lip);
        g.fillRect(11, 10, 2, 1);

        // Neck.
        g.fillStyle(skin);
        g.fillRect(11, 12, 2, 1);

        // Wine dress.
        g.fillStyle(dress);
        g.fillRect(8, 13, 8, 5);
        g.fillRect(7, 16, 10, 3);
        g.fillStyle(dressLight);
        g.fillRect(9, 13, 6, 1);
        g.fillStyle(dressDark);
        g.fillRect(7, 18, 10, 1);

        // Arms.
        g.fillStyle(skin);
        g.fillRect(step === 1 ? 6 : 7, 14, 1, 4);
        g.fillRect(step === 2 ? 17 : 16, 14, 1, 4);

        // Legs / shoes.
        g.fillStyle(skinShadow);
        g.fillRect(step === 1 ? 9 : 10, 19, 2, 2);
        g.fillRect(step === 2 ? 13 : 12, 19, 2, 2);
        g.fillStyle(shoe);
        g.fillRect(step === 1 ? 8 : 10, 21, 3, 1);
        g.fillRect(step === 2 ? 13 : 12, 21, 3, 1);
      }

      if (dir === "up") {
        // Back hair, solid black with a very subtle near-black sheen.
        g.fillStyle(hair);
        g.fillRect(7, 1, 10, 2);
        g.fillRect(6, 2, 12, 10);
        g.fillRect(5, 6, 2, 8);
        g.fillRect(17, 6, 2, 8);
        g.fillStyle(hairSoft);
        g.fillRect(10, 3, 4, 1);

        // Neck.
        g.fillStyle(skin);
        g.fillRect(11, 12, 2, 1);

        // Dress back.
        g.fillStyle(dress);
        g.fillRect(8, 13, 8, 5);
        g.fillRect(7, 16, 10, 3);
        g.fillStyle(dressLight);
        g.fillRect(9, 13, 6, 1);
        g.fillStyle(dressDark);
        g.fillRect(7, 18, 10, 1);

        // Arms.
        g.fillStyle(skinShadow);
        g.fillRect(step === 1 ? 6 : 7, 14, 1, 4);
        g.fillRect(step === 2 ? 17 : 16, 14, 1, 4);

        // Shoes.
        g.fillStyle(shoe);
        g.fillRect(step === 1 ? 8 : 10, 20, 3, 2);
        g.fillRect(step === 2 ? 13 : 12, 20, 3, 2);
      }

      if (dir === "side") {
        // Cleaner feminine profile hair.
        g.fillStyle(hair);
        g.fillRect(8, 1, 8, 2);
        g.fillRect(7, 2, 10, 4);
        g.fillRect(6, 5, 3, 9);
        g.fillRect(15, 5, 3, 8);
        g.fillStyle(hairSoft);
        g.fillRect(10, 3, 4, 1);

        // Face profile without the old beard-like shadow strip.
        g.fillStyle(skin);
        g.fillRect(9, 5, 8, 7);

        // Eye + lash.
        g.fillStyle(lash);
        g.fillRect(13, 7, 1, 1);
        g.fillStyle(eye);
        g.fillRect(14, 7, 1, 1);

        // Tiny cheek + mouth.
        g.fillStyle(cheek);
        g.fillRect(14, 9, 1, 1);
        g.fillStyle(lip);
        g.fillRect(15, 10, 1, 1);

        // Neck.
        g.fillStyle(skin);
        g.fillRect(11, 12, 2, 1);

        // Dress.
        g.fillStyle(dress);
        g.fillRect(9, 13, 7, 5);
        g.fillRect(8, 16, 9, 3);
        g.fillStyle(dressLight);
        g.fillRect(10, 13, 5, 1);
        g.fillStyle(dressDark);
        g.fillRect(8, 18, 9, 1);

        // Arm swing.
        g.fillStyle(skin);
        g.fillRect(step === 1 ? 8 : 9, 14, 1, 4);

        // Legs / shoes.
        g.fillStyle(shoe);
        g.fillRect(step === 1 ? 8 : 10, 20, 3, 2);
        g.fillRect(step === 2 ? 14 : 12, 20, 3, 2);
      }

      g.generateTexture(key, 24, 24);
    };

    drawHero("hero-down-0", "down", 0);
    drawHero("hero-down-1", "down", 1);
    drawHero("hero-down-2", "down", 2);

    drawHero("hero-up-0", "up", 0);
    drawHero("hero-up-1", "up", 1);
    drawHero("hero-up-2", "up", 2);

    drawHero("hero-side-0", "side", 0);
    drawHero("hero-side-1", "side", 1);
    drawHero("hero-side-2", "side", 2);

    if (!this.textures.exists("fox")) {
      g.clear();
      g.fillStyle(0xf2f2ef);
      g.fillTriangle(3, 7, 5, 2, 7, 7);
      g.fillTriangle(9, 7, 11, 2, 13, 7);
      g.fillEllipse(8, 9, 10, 8);
      g.fillEllipse(9, 14, 12, 5);
      g.generateTexture("fox", 16, 18);
    }

    // Full mystery pine — one texture, never split across atlas frames.
    g.clear();
    g.fillStyle(0x24272c);
    g.fillRect(17, 35, 6, 9);
    g.fillStyle(0x637c69);
    g.fillTriangle(20, 2, 5, 24, 35, 24);
    g.fillTriangle(20, 10, 2, 34, 38, 34);
    g.fillStyle(0x829989);
    g.fillTriangle(20, 4, 9, 21, 31, 21);
    g.fillTriangle(20, 13, 7, 30, 33, 30);
    g.fillStyle(0xdce6e8);
    g.fillRect(13, 10, 7, 3);
    g.fillRect(8, 22, 8, 3);
    g.fillRect(24, 18, 7, 3);
    g.fillRect(17, 29, 9, 3);
    g.generateTexture("mystery-tree", 40, 46);

    // Fox standing idle, side view.
    g.clear();
    g.fillStyle(0x2a2522);
    g.fillRect(10, 9, 25, 12);
    g.fillStyle(0xb97843);
    g.fillRect(12, 7, 22, 11);
    g.fillRect(5, 12, 10, 7);
    g.fillRect(32, 11, 8, 8);
    g.fillStyle(0xd59a63);
    g.fillRect(7, 13, 8, 4);
    g.fillRect(34, 12, 5, 4);
    g.fillStyle(0xe8d0ae);
    g.fillRect(34, 15, 6, 3);
    g.fillRect(10, 17, 6, 3);
    g.fillStyle(0x1a1716);
    g.fillRect(37, 12, 2, 2);
    g.fillRect(40, 15, 2, 2);
    g.fillRect(14, 20, 3, 6);
    g.fillRect(28, 19, 3, 7);
    g.fillStyle(0xb97843);
    g.fillRect(2, 13, 5, 4);
    g.fillRect(0, 11, 4, 3);
    g.generateTexture("fox-idle", 44, 28);

    // Fox sitting, front view for the rune destination.
    g.clear();
    g.fillStyle(0x2a2522);
    g.fillTriangle(11, 8, 15, 1, 19, 8);
    g.fillTriangle(25, 8, 29, 1, 33, 8);
    g.fillStyle(0xb97843);
    g.fillRect(12, 6, 20, 14);
    g.fillRect(15, 18, 14, 13);
    g.fillStyle(0xd59a63);
    g.fillRect(15, 9, 14, 8);
    g.fillStyle(0xe8d0ae);
    g.fillRect(18, 13, 8, 6);
    g.fillStyle(0x1a1716);
    g.fillRect(16, 11, 2, 2);
    g.fillRect(26, 11, 2, 2);
    g.fillRect(21, 16, 2, 2);
    g.fillStyle(0xb97843);
    g.fillRect(7, 23, 9, 5);
    g.fillRect(4, 26, 8, 4);
    g.fillStyle(0xe8d0ae);
    g.fillRect(4, 27, 4, 3);
    g.fillStyle(0x2a2522);
    g.fillRect(14, 29, 5, 3);
    g.fillRect(25, 29, 5, 3);
    g.generateTexture("fox-sit", 40, 34);

    g.clear();

    // Ancient rune stone - irregular pixel silhouette.
    g.fillStyle(0x151c22);
    g.fillRect(8, 2, 16, 2);
    g.fillRect(5, 4, 22, 4);
    g.fillRect(3, 8, 26, 24);
    g.fillRect(5, 32, 22, 4);
    g.fillRect(8, 36, 16, 2);

    // Stone inner face.
    g.fillStyle(0x27343e);
    g.fillRect(6, 7, 20, 25);
    g.fillStyle(0x344650);
    g.fillRect(7, 8, 3, 21);
    g.fillRect(10, 7, 12, 2);

    // Small chips in the stone.
    g.fillStyle(0x0e1419);
    g.fillRect(4, 12, 3, 4);
    g.fillRect(25, 22, 3, 5);
    g.fillRect(9, 33, 4, 2);

    // Cyan carved rune.
    g.lineStyle(2, 0xaeeef3, 1);
    g.strokeCircle(16, 19, 8);
    g.lineBetween(16, 10, 16, 28);
    g.lineBetween(12, 14, 16, 10);
    g.lineBetween(20, 14, 16, 10);
    g.lineBetween(12, 24, 16, 28);
    g.lineBetween(20, 24, 16, 28);

    // Bright rune core.
    g.fillStyle(0xd9fbff, 0.95);
    g.fillRect(15, 18, 2, 2);
    g.fillStyle(0x82dfe9, 0.85);
    g.fillRect(8, 11, 2, 2);
    g.fillRect(23, 15, 2, 2);
    g.fillRect(7, 27, 2, 2);
    g.fillRect(23, 29, 2, 2);

    g.generateTexture("rune", 32, 40);

    g.destroy();
  }
}

class TitleScene extends Phaser.Scene {
  constructor() { super("title"); }

  create() {
    const app = document.querySelector("#app");
    const gameRoot = document.querySelector("#game");
    app.classList.add("is-title");
    gameRoot.style.display = "none";
    this.cameras.main.setBackgroundColor("#070b10");
    this.createSnow(110);

    if (this.textures.exists("winter")) {
      for (let x = 0; x < GAME_WIDTH; x += 48) {
        for (let y = GAME_HEIGHT * .68; y < GAME_HEIGHT; y += 48) {
          this.add.image(x, y, "winter", 2)
            .setOrigin(0)
            .setScale(3)
            .setAlpha(.34);
        }
      }
    }

    show(ui.title);
    hide(ui.hud);
    hide(ui.controls);
    hide(ui.prompt);
    hide(ui.dialogue);
  }

  createSnow(amount) {
    for (let i = 0; i < amount; i++) {
      const flake = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(-30, GAME_HEIGHT),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(.18, .72)
      );
      this.tweens.add({
        targets: flake,
        y: GAME_HEIGHT + 30,
        x: flake.x + Phaser.Math.Between(-60, 60),
        duration: Phaser.Math.Between(6000, 13000),
        delay: Phaser.Math.Between(-10000, 0),
        repeat: -1
      });
    }
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
    this.dialogueOpen = false;
    this.dialogueIndex = 0;
    this.foxTalked = false;
    this.foxState = "waiting";
    this.foxTarget = null;
    this.foxGuideStage = 0;
    this.afterDialogue = null;
    this.lastFootstepAt = 0;
    this.lastSnowKickAt = 0;
  }

  create() {
    hide(ui.title);
    show(ui.hud);
    show(ui.controls);
    ui.area.textContent = "Floresta de Inverno";
    ui.objective.textContent = "Encontre a raposa";

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor("#cbd2d9");

    this.obstacles = this.physics.add.staticGroup();
    this.buildMap();
    this.createAtmosphere();

    this.lastFacing = "down";
    this.player = this.physics.add.sprite(310, BASE_WORLD_HEIGHT - 165, "hero-down-0");
    this.player.setScale(2.65);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(500);
    this.player.body.setSize(10, 8);
    this.player.body.setOffset(7, 14);

    this.playerShadow = this.add.ellipse(
      this.player.x,
      this.player.y + 22,
      26,
      10,
      0x000000,
      0.18
    ).setDepth(488);

    this.playerMarker = this.add.ellipse(
      this.player.x,
      this.player.y + 21,
      23,
      9,
      0x9bd9f3,
      0.24
    ).setDepth(489);

    this.playerArrow = this.add.triangle(
      this.player.x,
      this.player.y - 26,
      0, 0,
      8, 0,
      4, 6,
      0xeaf8ff,
      0.82
    ).setDepth(610);

    if (!this.anims.exists("hero-down-walk")) {
      this.anims.create({
        key: "hero-down-walk",
        frames: [
          { key: "hero-down-0" },
          { key: "hero-down-1" },
          { key: "hero-down-0" },
          { key: "hero-down-2" }
        ],
        frameRate: 9,
        repeat: -1
      });

      this.anims.create({
        key: "hero-up-walk",
        frames: [
          { key: "hero-up-0" },
          { key: "hero-up-1" },
          { key: "hero-up-0" },
          { key: "hero-up-2" }
        ],
        frameRate: 9,
        repeat: -1
      });

      this.anims.create({
        key: "hero-side-walk",
        frames: [
          { key: "hero-side-0" },
          { key: "hero-side-1" },
          { key: "hero-side-0" },
          { key: "hero-side-2" }
        ],
        frameRate: 10,
        repeat: -1
      });
    }

    this.foxFacing = "left";
    this.hasPublicFox =
      this.textures.exists("fox-public-idle") &&
      this.textures.exists("fox-public-walk");

    if (this.hasPublicFox && !this.anims.exists("fox-public-idle-anim")) {
      this.anims.create({
        key: "fox-public-idle-anim",
        frames: this.anims.generateFrameNumbers("fox-public-idle", { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1
      });

      this.anims.create({
        key: "fox-public-walk-anim",
        frames: this.anims.generateFrameNumbers("fox-public-walk", { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });

      if (this.textures.exists("fox-public-run")) {
        this.anims.create({
          key: "fox-public-run-anim",
          frames: this.anims.generateFrameNumbers("fox-public-run", { start: 0, end: 5 }),
          frameRate: 10,
          repeat: -1
        });
      }
    }

    this.fox = this.physics.add.sprite(
      BASE_WORLD_WIDTH * .67,
      BASE_WORLD_HEIGHT * .43,
      this.hasPublicFox ? "fox-public-idle" : "fox",
      0
    )
      .setScale(this.hasPublicFox ? 1.45 : 3.4)
      .setDepth(520)
      .setImmovable(true);

    this.fox.body.setAllowGravity(false);
    if (this.hasPublicFox) {
      this.fox.body.setSize(42, 15);
      this.fox.body.setOffset(11, 19);
    } else {
      this.fox.body.setSize(12, 9);
      this.fox.body.setOffset(2, 7);
    }
    this.setFoxIdle();

    this.foxMarker = this.add.ellipse(
      this.fox.x,
      this.fox.y + 14,
      28,
      10,
      0xe49b55,
      0.20
    ).setDepth(514);

    this.foxPointer = this.add.triangle(
      this.fox.x,
      this.fox.y - 34,
      0, 0,
      8, 0,
      4, 6,
      0xf1b56f,
      0.86
    ).setDepth(620);

    this.rune = this.physics.add.staticImage(WORLD_WIDTH - 230, 245, "rune")
      .setScale(1.75)
      .setDepth(510);

    this.runeGlow = this.add.circle(
      this.rune.x,
      this.rune.y,
      32,
      0x8fe8ef,
      0.16
    ).setDepth(504);

    this.runeHalo = this.add.circle(
      this.rune.x,
      this.rune.y,
      48,
      0x8fe8ef,
      0.055
    ).setDepth(503);

    this.rune.refreshBody();

    this.createRuneClearing();
    this.createMysteryAmbience();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.fox);
    this.physics.add.collider(this.player, this.rune);

    this.cameras.main.startFollow(this.player, true, .075, .075);
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.cameras.main.setZoom(1.0);

    this.keys = this.input.keyboard.addKeys({
      up: "W", down: "S", left: "A", right: "D", interact: "E"
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    this.tweens.add({
      targets: this.foxPointer,
      y: this.foxPointer.y - 5,
      alpha: { from: 0.52, to: 0.95 },
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.tweens.add({
      targets: this.foxMarker,
      alpha: { from: 0.10, to: 0.24 },
      scaleX: { from: 1, to: 1.18 },
      scaleY: { from: 1, to: 1.18 },
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.tweens.add({
      targets: this.runeGlow,
      alpha: { from: 0.08, to: 0.26 },
      scale: { from: 1, to: 1.30 },
      duration: 1450,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.tweens.add({
      targets: this.runeHalo,
      alpha: { from: 0.025, to: 0.095 },
      scale: { from: 0.92, to: 1.18 },
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.tweens.add({
      targets: this.playerMarker,
      alpha: { from: 0.16, to: 0.30 },
      scaleX: { from: 1, to: 1.08 },
      scaleY: { from: 1, to: 1.08 },
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.tweens.add({
      targets: this.playerArrow,
      y: this.playerArrow.y - 4,
      alpha: { from: 0.55, to: 0.95 },
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.time.delayedCall(7000, () => hide(ui.controls));
  }

  addWinterTree(x, groundY, variant = 0, scale = 1, alpha = 0.97) {
    if (!this.textures.exists("winter")) return null;

    const topId = variant === 1 ? 8 : 7;
    const bottomId = variant === 1 ? 20 : 19;
    const spriteScale = TILE_SCALE * scale;
    const cellStep = TILE * spriteScale;

    // Keep the full two-tile tree inside the world.
    // Without this, trees near the far-right/top/bottom edge can be visibly cropped
    // because the camera cannot move beyond the world bounds.
    const halfWidth = (TILE * spriteScale) / 2;
    const sideMargin = Math.max(72, halfWidth + 36);
    const topMargin = cellStep + 36;
    const bottomMargin = 42;

    const safeX = Phaser.Math.Clamp(
      x,
      sideMargin,
      WORLD_WIDTH - sideMargin
    );
    const safeGroundY = Phaser.Math.Clamp(
      groundY,
      topMargin,
      WORLD_HEIGHT - bottomMargin
    );

    const depth = 100 + safeGroundY;

    this.add.image(safeX, safeGroundY - cellStep, "winter", topId - 1)
      .setScale(spriteScale)
      .setDepth(depth)
      .setAlpha(alpha);

    const trunk = this.obstacles.create(safeX, safeGroundY, "winter", bottomId - 1)
      .setScale(spriteScale)
      .setDepth(depth)
      .setAlpha(alpha);

    trunk.refreshBody();
    trunk.body.setSize(10, 7);
    trunk.body.setOffset(3, 8);
    return trunk;
  }

  buildMap() {
    const collidable = new Set([21, 22, 23, 24, 34, 35, 36, 70, 80, 82]);

    for (let row = 0; row < WORLD_ROWS; row++) {
      for (let col = 0; col < WORLD_COLS; col++) {
        const inOriginalMap = row < BASE_WORLD_ROWS && col < BASE_WORLD_COLS;
        const idx = inOriginalMap ? (row * BASE_WORLD_COLS + col) : -1;
        const x = col * TILE * TILE_SCALE;
        const y = row * TILE * TILE_SCALE;
        const terrainId = inOriginalMap ? TERRAIN[idx] : 3;

        if (this.textures.exists("winter") && terrainId > 0) {
          this.add.image(x, y, "winter", terrainId - 1)
            .setOrigin(0)
            .setScale(TILE_SCALE)
            .setDepth(0);
        }

        let objectId = inOriginalMap ? OBJECTS[idx] : 0;
        if ([59, 60, 71, 84].includes(objectId)) objectId = 0;
        if (!objectId) continue;

        const cx = x + (TILE * TILE_SCALE) / 2;
        const cy = y + (TILE * TILE_SCALE) / 2;

        if (objectId === 7 || objectId === 8) {
          const expectedBottom = objectId === 7 ? 19 : 20;
          const below = row + 1 < BASE_WORLD_ROWS
            ? OBJECTS[(row + 1) * BASE_WORLD_COLS + col]
            : 0;

          if (below === expectedBottom) {
            this.addWinterTree(
              cx,
              cy + (TILE * TILE_SCALE),
              objectId === 8 ? 1 : 0,
              1,
              0.98
            );
            continue;
          }
        }

        if (objectId === 19 || objectId === 20) {
          const expectedTop = objectId === 19 ? 7 : 8;
          const above = row > 0
            ? OBJECTS[(row - 1) * BASE_WORLD_COLS + col]
            : 0;
          if (above === expectedTop) continue;
        }

        if (objectId === 31 || objectId === 32) {
          const tree = this.obstacles.create(cx, cy, "winter", objectId - 1)
            .setScale(TILE_SCALE)
            .setDepth(100 + cy)
            .setAlpha(0.98);
          tree.refreshBody();
          tree.body.setSize(10, 7);
          tree.body.setOffset(3, 8);
          continue;
        }

        if (!this.textures.exists("winter")) continue;

        if (collidable.has(objectId)) {
          const obj = this.obstacles.create(cx, cy, "winter", objectId - 1)
            .setScale(TILE_SCALE)
            .setDepth(100 + cy);
          obj.refreshBody();
          obj.body.setSize(12, 8);
          obj.body.setOffset(2, 7);
        } else {
          this.add.image(cx, cy, "winter", objectId - 1)
            .setScale(TILE_SCALE)
            .setDepth(80 + cy);
        }
      }
    }

    const trees = [
      [1540,170,0,.96],[1700,190,1,.90],[1870,165,0,1.02],[2055,195,1,.94],[2240,170,0,.98],[2360,210,1,.90],
      [1510,770,1,.96],[1680,815,0,.90],[1850,775,0,1.02],[2040,830,1,.94],[2225,775,0,.98],[2360,820,1,.90],
      [1590,420,0,.88],[1800,400,1,.98],[2000,455,0,.92],[2180,415,1,1.00],[2320,460,0,.88],
      [1570,1080,1,1.00],[1760,1040,0,.90],[1960,1110,0,1.02],[2160,1060,1,.96],[2330,1120,0,.92],
      [1580,1390,0,.94],[1770,1450,1,1.00],[1980,1375,0,.90],[2200,1460,1,1.02],[2350,1395,0,.96]
    ];

    for (const [x, y, variant, scale] of trees) {
      this.addWinterTree(x, y, variant, scale, 0.97);
    }
  }

  createRuneClearing() {
    if (!this.rune) return;

    const trees = [
      [this.rune.x - 185, this.rune.y - 70, 0, 1.03],
      [this.rune.x + 175, this.rune.y - 65, 1, .98],
      [this.rune.x - 195, this.rune.y + 150, 1, .94],
      [this.rune.x + 190, this.rune.y + 150, 0, 1.02],
      [this.rune.x - 75, this.rune.y - 165, 0, .88],
      [this.rune.x + 85, this.rune.y + 185, 1, .90]
    ];

    for (const [x, y, variant, scale] of trees) {
      this.addWinterTree(x, y, variant, scale, 0.98);
    }
  }

  createMysteryAmbience() {
    // Soft blue wisps and dark mist make the far side feel different from the starting area.
    this.mysteryWisps = [];
    const wispSpots = [
      [1580,460],[1735,430],[1870,650],[2025,470],[2160,650],
      [2290,430],[2380,610],[1880,940],[2150,980],[2350,1160]
    ];

    for (const [x, y] of wispSpots) {
      const glow = this.add.circle(x, y, Phaser.Math.Between(5, 9), 0x8fdce8, 0.10)
        .setDepth(160);

      this.tweens.add({
        targets: glow,
        y: y - Phaser.Math.Between(10, 22),
        x: x + Phaser.Math.Between(-12, 12),
        alpha: { from: 0.04, to: 0.16 },
        scale: { from: 0.85, to: 1.45 },
        duration: Phaser.Math.Between(1800, 3200),
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });

      this.mysteryWisps.push(glow);
    }

    const mistZones = [
      [1710,840,210,85],
      [2060,880,250,95],
      [2290,720,190,75],
      [1940,1210,260,95]
    ];

    for (const [x, y, w, h] of mistZones) {
      const mist = this.add.ellipse(x, y, w, h, 0x26333c, 0.055).setDepth(70);
      this.tweens.add({
        targets: mist,
        x: x + Phaser.Math.Between(-24, 24),
        alpha: { from: 0.025, to: 0.075 },
        duration: Phaser.Math.Between(3600, 5200),
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    }

    // A faint halo makes the distant rune clearing readable without revealing too much.
    this.runeClearingGlow = this.add.circle(
      this.rune.x,
      this.rune.y,
      115,
      0x78cfd9,
      0.025
    ).setDepth(65);
  }

  createAtmosphere() {
    this.snow = [];
    for (let i = 0; i < 105; i++) {
      const flake = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(.18, .6)
      ).setScrollFactor(0).setDepth(2000);
      flake.speed = Phaser.Math.FloatBetween(.35, 1.15);
      flake.drift = Phaser.Math.FloatBetween(-.18, .18);
      this.snow.push(flake);
    }
  }

  update() {
    this.updateSnow();

    if (this.playerShadow) {
      this.playerShadow.setPosition(this.player.x, this.player.y + 22);
    }
    if (this.playerMarker) {
      this.playerMarker.setPosition(this.player.x, this.player.y + 21);
    }
    if (this.playerArrow) {
      this.playerArrow.setPosition(this.player.x, this.player.y - 26);
    }
    if (this.foxMarker) {
      this.foxMarker.setPosition(this.fox.x, this.fox.y + 14);
    }
    if (this.foxPointer) {
      this.foxPointer.setPosition(this.fox.x, this.fox.y - 34);
    }

    this.updateFoxGuide();

    if (this.dialogueOpen) {
      this.player.setVelocity(0);
      this.player.anims.stop();
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) this.advanceDialogue();
      return;
    }

    const speed = 170;
    let x = 0;
    let y = 0;

    if (this.keys.left.isDown || this.cursors.left.isDown) x -= 1;
    if (this.keys.right.isDown || this.cursors.right.isDown) x += 1;
    if (this.keys.up.isDown || this.cursors.up.isDown) y -= 1;
    if (this.keys.down.isDown || this.cursors.down.isDown) y += 1;

    const dir = new Phaser.Math.Vector2(x, y);
    if (dir.lengthSq() > 0) {
      dir.normalize().scale(speed);
      this.player.setVelocity(dir.x, dir.y);

      if (x !== 0) {
        this.lastFacing = x < 0 ? "left" : "right";
        this.player.setFlipX(x < 0);
        this.player.anims.play("hero-side-walk", true);
      } else if (y < 0) {
        this.lastFacing = "up";
        this.player.setFlipX(false);
        this.player.anims.play("hero-up-walk", true);
      } else {
        this.lastFacing = "down";
        this.player.setFlipX(false);
        this.player.anims.play("hero-down-walk", true);
      }

      if (this.time.now - this.lastFootstepAt > 285) {
        this.lastFootstepAt = this.time.now;
        if (window.WinterAudio) window.WinterAudio.play("step");
      }

      if (this.time.now - this.lastSnowKickAt > 115) {
        this.lastSnowKickAt = this.time.now;
        this.kickSnow();
      }
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();

      if (this.lastFacing === "up") {
        this.player.setTexture("hero-up-0");
        this.player.setFlipX(false);
      } else if (this.lastFacing === "left") {
        this.player.setTexture("hero-side-0");
        this.player.setFlipX(true);
      } else if (this.lastFacing === "right") {
        this.player.setTexture("hero-side-0");
        this.player.setFlipX(false);
      } else {
        this.player.setTexture("hero-down-0");
        this.player.setFlipX(false);
      }
    }

    const foxDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fox.x, this.fox.y);
    const runeDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rune.x, this.rune.y);

    if (foxDistance < 105 && this.foxState === "waiting") {
      this.setPrompt(this.foxTalked ? "Falar com a raposa" : "Conversar com a raposa");
      ui.objective.textContent = this.foxTalked ? "Acompanhe a raposa" : "Converse com a raposa";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        if (window.WinterAudio) window.WinterAudio.play("interact");
        this.burstSparkles(this.fox.x, this.fox.y, 0xf0b66f, 10);
        this.startFoxDialogue();
      }
    } else if (runeDistance < 90) {
      this.setPrompt("Examinar a runa");
      ui.objective.textContent = "Examine a runa";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        if (window.WinterAudio) window.WinterAudio.play("rune");
        this.burstSparkles(this.rune.x, this.rune.y, 0x9be6ef, 14);
        this.cameras.main.shake(90, 0.0012);
        this.openDialogue([
          ["PEDRA RÚNICA", "Um símbolo foi gravado no gelo. Você tem a sensação de que ainda não deveria entendê-lo."]
        ]);
      }
    } else {
      hide(ui.prompt);
      ui.objective.textContent = this.foxTalked ? "Siga a raposa" : "Encontre a raposa";
    }
  }

  setFoxIdle() {
    if (!this.fox) return;

    this.fox.setVelocity(0);
    this.fox.setAngle(0);

    if (this.hasPublicFox) {
      if (this.fox.texture.key !== "fox-public-idle") {
        this.fox.anims.stop();
        this.fox.setTexture("fox-public-idle", 0);
      }
      this.fox.setScale(1.45);
      this.fox.setFlipX(this.foxFacing === "right");

      if (this.fox.anims.currentAnim?.key !== "fox-public-idle-anim") {
        this.fox.anims.play("fox-public-idle-anim", true);
      }
    } else {
      this.fox.anims.stop();
      this.fox.setTexture("fox");
      this.fox.setScale(3.4);
    }
  }

  setFoxSitting() {
    if (!this.fox) return;

    this.setFoxIdle();

    if (this.foxRestTween) {
      this.foxRestTween.stop();
      this.foxRestTween = null;
    }

    const baseScale = this.hasPublicFox ? 1.45 : 3.4;
    this.foxRestTween = this.tweens.add({
      targets: this.fox,
      scaleY: { from: baseScale, to: baseScale * 0.975 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });
  }

  playFoxWalk(dx, dy) {
    if (!this.fox) return;

    if (this.foxRestTween) {
      this.foxRestTween.stop();
      this.foxRestTween = null;
    }

    if (Math.abs(dx) > 1) {
      this.foxFacing = dx < 0 ? "left" : "right";
    }

    if (this.hasPublicFox) {
      if (this.fox.texture.key !== "fox-public-walk") {
        this.fox.anims.stop();
        this.fox.setTexture("fox-public-walk", 0);
      }
      this.fox.setScale(1.45);
      this.fox.setFlipX(this.foxFacing === "right");

      if (this.fox.anims.currentAnim?.key !== "fox-public-walk-anim") {
        this.fox.anims.play("fox-public-walk-anim", true);
      }
    } else {
      this.fox.setScale(3.4);
    }
  }

  finishFoxGuide() {
    this.foxState = "arrived";
    this.foxTarget = null;

    // Sit directly in front of the rune (below it on screen).
    this.fox.setPosition(this.rune.x, this.rune.y + 105);
    this.setFoxSitting();

    this.foxPointer.setVisible(false);
    this.foxMarker.setVisible(false);

    ui.objective.textContent = "Examine a runa";

    this.burstSparkles(this.fox.x, this.fox.y, 0xf0b66f, 10);
    this.burstSparkles(this.rune.x, this.rune.y, 0x9beaf0, 16);

    if (window.WinterAudio) window.WinterAudio.play("rune");
  }

  sendFoxAhead() {
    if (!this.foxGuidePoints) {
      this.foxGuidePoints = [
        { x: 1120, y: 430 },
        { x: 1320, y: 500 },
        { x: 1510, y: 455 },
        { x: 1680, y: 560 },
        { x: 1840, y: 500 },
        { x: 1990, y: 640 },
        { x: 2140, y: 545 },
        { x: 2265, y: 430 },
        { x: this.rune.x, y: this.rune.y + 105 }
      ];
    }

    if (this.foxGuideStage >= this.foxGuidePoints.length) {
      this.finishFoxGuide();
      return;
    }

    this.foxTarget = this.foxGuidePoints[this.foxGuideStage];
    this.foxGuideStage += 1;
    this.foxState = "moving";
    this.foxPointer.setVisible(true);
    this.foxMarker.setVisible(true);
    ui.objective.textContent = "Siga a raposa";
  }

  updateFoxGuide() {
    if (!this.fox || this.foxState !== "moving" || !this.foxTarget) return;

    const dx = this.foxTarget.x - this.fox.x;
    const dy = this.foxTarget.y - this.fox.y;
    const distance = Math.hypot(dx, dy);

    // Finish immediately and deterministically at the last destination.
    if (distance < 14) {
      this.fox.setPosition(this.foxTarget.x, this.foxTarget.y);
      this.foxTarget = null;

      if (this.foxGuideStage >= this.foxGuidePoints.length) {
        this.finishFoxGuide();
      } else {
        this.setFoxIdle();
        this.sendFoxAhead();
      }
      return;
    }

    const playerDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.fox.x,
      this.fox.y
    );

    if (playerDistance > 360) {
      this.setFoxIdle();
      ui.objective.textContent = "Alcance a raposa";
      return;
    }

    ui.objective.textContent = "Siga a raposa";

    const speed = 132;
    this.fox.setVelocity((dx / distance) * speed, (dy / distance) * speed);
    this.playFoxWalk(dx, dy);

    if (Math.random() < 0.08) {
      const puff = this.add.circle(
        this.fox.x + Phaser.Math.Between(-6, 6),
        this.fox.y + 18,
        Phaser.Math.FloatBetween(1.2, 2.4),
        0xffffff,
        Phaser.Math.FloatBetween(0.22, 0.42)
      ).setDepth(512);

      this.tweens.add({
        targets: puff,
        y: puff.y + Phaser.Math.Between(4, 9),
        x: puff.x + Phaser.Math.Between(-5, 5),
        alpha: 0,
        scale: 1.7,
        duration: Phaser.Math.Between(320, 520),
        onComplete: () => puff.destroy()
      });
    }
  }

  kickSnow() {
    for (let i = 0; i < 2; i++) {
      const puff = this.add.circle(
        this.player.x + Phaser.Math.Between(-7, 7),
        this.player.y + 20,
        Phaser.Math.FloatBetween(1.2, 2.6),
        0xffffff,
        Phaser.Math.FloatBetween(0.20, 0.42)
      ).setDepth(492);

      this.tweens.add({
        targets: puff,
        x: puff.x + Phaser.Math.Between(-7, 7),
        y: puff.y + Phaser.Math.Between(3, 9),
        alpha: 0,
        scale: Phaser.Math.FloatBetween(1.35, 1.9),
        duration: Phaser.Math.Between(300, 480),
        ease: "Sine.out",
        onComplete: () => puff.destroy()
      });
    }
  }

  burstSparkles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const sparkle = this.add.circle(
        x + Phaser.Math.Between(-8, 8),
        y + Phaser.Math.Between(-6, 8),
        Phaser.Math.FloatBetween(1.1, 2.1),
        color,
        Phaser.Math.FloatBetween(0.55, 0.9)
      ).setDepth(1800);

      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(12, 30);

      this.tweens.add({
        targets: sparkle,
        x: sparkle.x + Math.cos(angle) * distance,
        y: sparkle.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.35,
        duration: Phaser.Math.Between(320, 560),
        ease: "Cubic.out",
        onComplete: () => sparkle.destroy()
      });
    }
  }

  updateSnow() {
    for (const flake of this.snow) {
      flake.y += flake.speed;
      flake.x += flake.drift;
      if (flake.y > GAME_HEIGHT + 4) {
        flake.y = -4;
        flake.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
      if (flake.x < -4) flake.x = GAME_WIDTH + 4;
      if (flake.x > GAME_WIDTH + 4) flake.x = -4;
    }
  }

  setPrompt(text) {
    ui.promptText.textContent = text;
    show(ui.prompt);
  }

  startFoxDialogue() {
    if (this.foxTalked) {
      this.afterDialogue = () => {
        this.sendFoxAhead();
      };
      this.openDialogue([
        ["RAPOSA", "Isso. Continue me seguindo."]
      ]);
      return;
    }

    this.foxTalked = true;
    this.afterDialogue = () => {
      this.sendFoxAhead();
    };

    this.openDialogue([
      ["RAPOSA", "Você finalmente chegou."],
      ["RAPOSA", "Este lugar já teve cores. O inverno ficou com quase todas elas."],
      ["RAPOSA", "Se quiser encontrá-las de novo, terá que aprender a enxergar o que muda entre o branco e o preto."],
      ["RAPOSA", "Venha. A primeira resposta está mais perto do que parece."]
    ]);
  }

  openDialogue(lines) {
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueOpen = true;
    hide(ui.prompt);
    show(ui.dialogue);
    this.renderDialogue();
  }

  renderDialogue() {
    const [speaker, text] = this.dialogueLines[this.dialogueIndex];
    ui.speaker.textContent = speaker;
    ui.text.textContent = text;
  }

  advanceDialogue() {
    if (window.WinterAudio) window.WinterAudio.play("dialogue");
    this.dialogueIndex += 1;
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.dialogueOpen = false;
      hide(ui.dialogue);

      const callback = this.afterDialogue;
      this.afterDialogue = null;
      if (callback) this.time.delayedCall(180, callback);
      return;
    }
    this.renderDialogue();
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  backgroundColor: "#070b10",
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [BootScene, TitleScene, GameScene]
};

const game = new Phaser.Game(config);

function startGame() {
  if (!game.scene.isActive("title")) return;
  const app = document.querySelector("#app");
  const gameRoot = document.querySelector("#game");
  app.classList.remove("is-title");
  if (window.WinterAudio) {
    window.WinterAudio.ensure();
    window.WinterAudio.startWind();
  }
  gameRoot.style.display = "block";
  gameRoot.style.background = "#05070b";
  hide(ui.title);
  game.scale.refresh();
  game.scene.start("game");
}

ui.start.addEventListener("click", startGame);
window.addEventListener("keydown", event => {
  if (event.key === "Enter" && game.scene.isActive("title")) startGame();
});