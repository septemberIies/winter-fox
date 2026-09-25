const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const TILE = 16;
const TILE_SCALE = 3;
const WORLD_COLS = 31;
const WORLD_ROWS = 18;
const WORLD_WIDTH = WORLD_COLS * TILE * TILE_SCALE;
const WORLD_HEIGHT = WORLD_ROWS * TILE * TILE_SCALE;

const ASSETS = {
  winterTiles: "https://raw.githubusercontent.com/Tiddybub/2d-assets/main/misc/tiny-ski/Tilemap/tilemap_packed.png",
  girl: "https://raw.githubusercontent.com/Tiddybub/2d-assets/main/characters/oga-miss-princess-animated-16x16/missprincess.png",
  fox: "https://raw.githubusercontent.com/AntumDeluge/game-resources/master/sprite/animal/fox/PNG/48x64/fox-NESW.png"
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
    this.load.spritesheet("fox", ASSETS.fox, { frameWidth: 48, frameHeight: 64 });

    this.load.on("loaderror", file => {
      console.warn("Asset não carregou:", file.key);
    });
  }

  create() {
    this.makeFallbackTextures();

    if (this.textures.exists("winter")) {
      this.textures.get("winter").setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    if (this.textures.exists("girl")) {
      this.textures.get("girl").setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    hide(ui.loading);
    this.scene.start("title");
  }

  makeFallbackTextures() {
    const g = this.make.graphics({ add: false });

    const skin = 0xf2d3bd;
    const skinShadow = 0xdcae93;
    const hair = 0x111216;
    const hairHighlight = 0x24262d;
    const eye = 0x6b4935;
    const dress = 0x6b2035;
    const dressLight = 0x8b314b;
    const dressDark = 0x471522;
    const shoe = 0x1c1f25;

    const drawHero = (key, dir, step = 0) => {
      g.clear();

      // shadow under feet baked into sprite
      g.fillStyle(0x000000, 0.12);
      g.fillEllipse(12, 22, 10, 3);

      if (dir === "down") {
        // Hair silhouette
        g.fillStyle(hair);
        g.fillRect(6, 2, 12, 4);
        g.fillRect(5, 5, 2, 8);
        g.fillRect(17, 5, 2, 8);
        g.fillRect(7, 1, 10, 2);

        // Face
        g.fillStyle(skin);
        g.fillRect(7, 5, 10, 7);
        g.fillStyle(skinShadow);
        g.fillRect(7, 11, 10, 1);

        // Hair fringe
        g.fillStyle(hairHighlight);
        g.fillRect(7, 4, 3, 2);
        g.fillRect(14, 4, 3, 2);
        g.fillStyle(hair);
        g.fillRect(10, 4, 4, 1);

        // Brown eyes
        g.fillStyle(eye);
        g.fillRect(9, 7, 1, 1);
        g.fillRect(14, 7, 1, 1);

        // neck
        g.fillStyle(skin);
        g.fillRect(11, 12, 2, 1);

        // Wine dress
        g.fillStyle(dress);
        g.fillRect(8, 13, 8, 5);
        g.fillRect(7, 16, 10, 3);
        g.fillStyle(dressLight);
        g.fillRect(9, 13, 6, 1);
        g.fillStyle(dressDark);
        g.fillRect(7, 18, 10, 1);

        // arms
        g.fillStyle(skin);
        g.fillRect(step === 1 ? 6 : 7, 14, 1, 4);
        g.fillRect(step === 2 ? 17 : 16, 14, 1, 4);

        // legs
        g.fillStyle(skinShadow);
        g.fillRect(step === 1 ? 9 : 10, 19, 2, 2);
        g.fillRect(step === 2 ? 13 : 12, 19, 2, 2);
        g.fillStyle(shoe);
        g.fillRect(step === 1 ? 8 : 10, 21, 3, 1);
        g.fillRect(step === 2 ? 13 : 12, 21, 3, 1);
      }

      if (dir === "up") {
        // Back hair
        g.fillStyle(hair);
        g.fillRect(6, 2, 12, 10);
        g.fillRect(5, 6, 2, 8);
        g.fillRect(17, 6, 2, 8);
        g.fillStyle(hairHighlight);
        g.fillRect(8, 3, 8, 2);

        // Neck
        g.fillStyle(skin);
        g.fillRect(11, 12, 2, 1);

        // Dress back
        g.fillStyle(dress);
        g.fillRect(8, 13, 8, 5);
        g.fillRect(7, 16, 10, 3);
        g.fillStyle(dressDark);
        g.fillRect(7, 18, 10, 1);
        g.fillStyle(dressLight);
        g.fillRect(9, 13, 6, 1);

        // arms
        g.fillStyle(skinShadow);
        g.fillRect(step === 1 ? 6 : 7, 14, 1, 4);
        g.fillRect(step === 2 ? 17 : 16, 14, 1, 4);

        // legs
        g.fillStyle(shoe);
        g.fillRect(step === 1 ? 8 : 10, 20, 3, 2);
        g.fillRect(step === 2 ? 13 : 12, 20, 3, 2);
      }

      if (dir === "side") {
        // Hair profile
        g.fillStyle(hair);
        g.fillRect(7, 2, 10, 4);
        g.fillRect(6, 5, 3, 9);
        g.fillRect(15, 5, 3, 8);
        g.fillStyle(hairHighlight);
        g.fillRect(9, 3, 6, 2);

        // Face profile
        g.fillStyle(skin);
        g.fillRect(9, 5, 8, 7);
        g.fillStyle(skinShadow);
        g.fillRect(9, 11, 8, 1);

        // Eye
        g.fillStyle(eye);
        g.fillRect(14, 7, 1, 1);

        // Dress
        g.fillStyle(dress);
        g.fillRect(9, 13, 7, 5);
        g.fillRect(8, 16, 9, 3);
        g.fillStyle(dressLight);
        g.fillRect(10, 13, 5, 1);
        g.fillStyle(dressDark);
        g.fillRect(8, 18, 9, 1);

        // arm swing
        g.fillStyle(skin);
        g.fillRect(step === 1 ? 8 : 9, 14, 1, 4);

        // legs
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

    g.clear();
    g.fillStyle(0x303843);
    g.fillRoundedRect(2, 2, 20, 28, 4);
    g.lineStyle(2, 0xd8e1ea, .8);
    g.strokeCircle(12, 14, 6);
    g.lineBetween(12, 8, 12, 20);
    g.generateTexture("rune", 24, 32);

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
    this.player = this.physics.add.sprite(310, WORLD_HEIGHT - 165, "hero-down-0");
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

    const foxFrames = this.textures.get("fox").frameTotal || 1;
    const foxFrame = foxFrames >= 12 ? 7 : 0;
    const foxScale = foxFrames >= 12 ? 1.15 : 3.4;
    this.fox = this.physics.add.staticImage(WORLD_WIDTH * .67, WORLD_HEIGHT * .43, "fox", foxFrame)
      .setScale(foxScale)
      .setDepth(520)
      .setTint(0xe49b55);

    this.foxMarker = this.add.ellipse(
      this.fox.x,
      this.fox.y + 12,
      20,
      8,
      0xe49b55,
      0.18
    ).setDepth(514);
    this.fox.refreshBody();

    this.rune = this.physics.add.staticImage(WORLD_WIDTH * .82, WORLD_HEIGHT * .29, "rune")
      .setScale(1.7)
      .setDepth(510)
      .setTint(0x8fd3df);

    this.runeGlow = this.add.circle(
      this.rune.x,
      this.rune.y,
      18,
      0x8fd3df,
      0.12
    ).setDepth(504);
    this.rune.refreshBody();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.fox);
    this.physics.add.collider(this.player, this.rune);

    this.cameras.main.startFollow(this.player, true, .075, .075);
    this.cameras.main.setZoom(1.0);

    this.keys = this.input.keyboard.addKeys({
      up: "W", down: "S", left: "A", right: "D", interact: "E"
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    this.tweens.add({
      targets: this.fox,
      y: this.fox.y - 4,
      duration: 1500,
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
      alpha: { from: 0.07, to: 0.23 },
      scale: { from: 1, to: 1.34 },
      duration: 1450,
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

  buildMap() {
    const collidable = new Set([7, 8, 19, 20, 21, 22, 23, 24, 31, 32, 34, 35, 36, 59, 60, 70, 71, 80, 82, 84]);

    for (let row = 0; row < WORLD_ROWS; row++) {
      for (let col = 0; col < WORLD_COLS; col++) {
        const idx = row * WORLD_COLS + col;
        const x = col * TILE * TILE_SCALE;
        const y = row * TILE * TILE_SCALE;
        const terrainId = TERRAIN[idx];

        if (this.textures.exists("winter") && terrainId > 0) {
          this.add.image(x, y, "winter", terrainId - 1)
            .setOrigin(0)
            .setScale(TILE_SCALE)
            .setDepth(0);
        }

        const objectId = OBJECTS[idx];
        if (!objectId || !this.textures.exists("winter")) continue;

        const cx = x + (TILE * TILE_SCALE) / 2;
        const cy = y + (TILE * TILE_SCALE) / 2;

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
      this.foxMarker.setPosition(this.fox.x, this.fox.y + 12);
    }

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

    if (foxDistance < 105) {
      this.setPrompt("Conversar com a raposa");
      ui.objective.textContent = "Converse com a raposa";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        if (window.WinterAudio) window.WinterAudio.play("interact");
        this.startFoxDialogue();
      }
    } else if (runeDistance < 90) {
      this.setPrompt("Observar a pedra rúnica");
      ui.objective.textContent = "Observe o símbolo";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        if (window.WinterAudio) window.WinterAudio.play("rune");
        this.openDialogue([
          ["PEDRA RÚNICA", "Um símbolo foi gravado no gelo. Você tem a sensação de que ainda não deveria entendê-lo."]
        ]);
      }
    } else {
      hide(ui.prompt);
      ui.objective.textContent = this.foxTalked ? "Explore a floresta" : "Encontre a raposa";
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
    this.foxTalked = true;
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