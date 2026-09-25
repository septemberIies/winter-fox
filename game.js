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
  fox: "https://opengameart.org/sites/default/files/fox_6.png"
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
    this.load.image("fox", ASSETS.fox);

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

    if (!this.textures.exists("girl")) {
      g.fillStyle(0xe8edf2);
      g.fillRoundedRect(5, 2, 6, 6, 2);
      g.fillStyle(0x202731);
      g.fillRect(4, 8, 8, 7);
      g.fillStyle(0x503a36);
      g.fillRect(4, 2, 8, 3);
      g.generateTexture("girl", 16, 16);
      g.clear();
    }

    if (!this.textures.exists("fox")) {
      g.fillStyle(0xf2f2ef);
      g.fillTriangle(3, 7, 5, 2, 7, 7);
      g.fillTriangle(9, 7, 11, 2, 13, 7);
      g.fillEllipse(8, 9, 10, 8);
      g.fillEllipse(9, 14, 12, 5);
      g.generateTexture("fox", 16, 18);
      g.clear();
    }

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

    const fox = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT * .61, "fox")
      .setScale(this.textures.get("fox").getSourceImage().width > 32 ? .42 : 3)
      .setAlpha(.72);

    this.tweens.add({
      targets: fox,
      y: fox.y - 6,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

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

    const girlFrameCount = this.textures.get("girl").frameTotal || 1;
    this.player = this.physics.add.sprite(310, WORLD_HEIGHT - 165, "girl", 0);
    this.player.setScale(3.25);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(500);
    this.player.body.setSize(9, 7);
    this.player.body.setOffset(3.5, 8);

    if (girlFrameCount >= 3) {
      this.anims.create({
        key: "girl-walk",
        frames: [{ key: "girl", frame: 0 }, { key: "girl", frame: 1 }, { key: "girl", frame: 2 }],
        frameRate: 7,
        repeat: -1
      });
    }

    const foxScale = this.textures.get("fox").getSourceImage().width > 32 ? .34 : 3.4;
    this.fox = this.physics.add.staticImage(WORLD_WIDTH * .67, WORLD_HEIGHT * .43, "fox")
      .setScale(foxScale)
      .setDepth(520);
    this.fox.refreshBody();

    this.rune = this.physics.add.staticImage(WORLD_WIDTH * .82, WORLD_HEIGHT * .29, "rune")
      .setScale(1.7)
      .setDepth(510);
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
      if (x !== 0) this.player.setFlipX(x < 0);
      if (this.anims.exists("girl-walk")) this.player.anims.play("girl-walk", true);
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    const foxDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.fox.x, this.fox.y);
    const runeDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.rune.x, this.rune.y);

    if (foxDistance < 105) {
      this.setPrompt("Conversar com a raposa");
      ui.objective.textContent = "Converse com a raposa";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) this.startFoxDialogue();
    } else if (runeDistance < 90) {
      this.setPrompt("Observar a pedra rúnica");
      ui.objective.textContent = "Observe o símbolo";
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
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
  hide(ui.title);
  game.scene.start("game");
}

ui.start.addEventListener("click", startGame);
window.addEventListener("keydown", event => {
  if (event.key === "Enter" && game.scene.isActive("title")) startGame();
});