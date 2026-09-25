const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create() {
    this.makeTextures();
    this.scene.start("title");
  }

  makeTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Player — small monochrome traveller.
    g.fillStyle(0xf2f2f2, 1);
    g.fillRect(7, 2, 10, 8);
    g.fillStyle(0x22262d, 1);
    g.fillRect(5, 10, 14, 12);
    g.fillStyle(0xc9cdd2, 1);
    g.fillRect(7, 22, 5, 8);
    g.fillRect(12, 22, 5, 8);
    g.fillStyle(0x111318, 1);
    g.fillRect(8, 5, 2, 2);
    g.fillRect(14, 5, 2, 2);
    g.generateTexture("player", 24, 32);
    g.clear();

    // Fox — white fox with a darker tail tip.
    g.fillStyle(0xf8f8f5, 1);
    g.fillTriangle(6, 9, 10, 1, 13, 9);
    g.fillTriangle(17, 9, 20, 1, 23, 10);
    g.fillEllipse(15, 13, 17, 13);
    g.fillEllipse(16, 24, 24, 12);
    g.fillStyle(0x1c2026, 1);
    g.fillRect(11, 11, 2, 2);
    g.fillRect(18, 11, 2, 2);
    g.fillRect(15, 15, 2, 2);
    g.fillStyle(0xa7adb5, 1);
    g.fillTriangle(24, 22, 31, 17, 30, 28);
    g.generateTexture("fox", 34, 32);
    g.clear();

    // Tree.
    g.fillStyle(0x2c3037, 1);
    g.fillRect(14, 28, 8, 24);
    g.fillStyle(0x11151b, 1);
    g.fillTriangle(18, 0, 1, 30, 35, 30);
    g.fillStyle(0x252b32, 1);
    g.fillTriangle(18, 10, 0, 40, 36, 40);
    g.fillStyle(0xe5e8eb, 0.9);
    g.fillTriangle(18, 2, 8, 18, 28, 18);
    g.fillTriangle(18, 14, 7, 30, 29, 30);
    g.generateTexture("tree", 36, 54);
    g.clear();

    // Rock.
    g.fillStyle(0x3a4048, 1);
    g.fillEllipse(15, 10, 28, 18);
    g.fillStyle(0x7d858f, 0.55);
    g.fillEllipse(11, 7, 12, 6);
    g.generateTexture("rock", 30, 20);
    g.clear();

    // Rune stone / future puzzle hook.
    g.fillStyle(0x323841, 1);
    g.fillRoundedRect(2, 4, 28, 36, 5);
    g.lineStyle(2, 0xdde5ef, 0.75);
    g.strokeCircle(16, 20, 7);
    g.lineBetween(16, 13, 16, 27);
    g.generateTexture("rune", 32, 42);
    g.destroy();
  }
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#090b0f");

    for (let i = 0; i < 85; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(-20, height);
      const size = Phaser.Math.Between(1, 3);
      const flake = this.add.circle(x, y, size, 0xf5f7fa, Phaser.Math.FloatBetween(0.2, 0.8));
      this.tweens.add({
        targets: flake,
        y: height + 30,
        x: x + Phaser.Math.Between(-45, 45),
        duration: Phaser.Math.Between(5000, 11000),
        repeat: -1,
        delay: Phaser.Math.Between(-9000, 0)
      });
    }

    this.add.text(width / 2, height * 0.31, "WINTER FOX", {
      fontFamily: "Georgia, serif",
      fontSize: "54px",
      color: "#f3f4f6",
      letterSpacing: 12
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.42, "uma pequena história no inverno", {
      fontFamily: "Georgia, serif",
      fontSize: "18px",
      color: "#8f98a4",
      fontStyle: "italic"
    }).setOrigin(0.5);

    const fox = this.add.image(width / 2, height * 0.57, "fox").setScale(2.4);
    this.tweens.add({
      targets: fox,
      y: fox.y - 6,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    const start = this.add.text(width / 2, height * 0.76, "[ COMEÇAR ]", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#f3f4f6",
      letterSpacing: 4,
      backgroundColor: "#11151b",
      padding: { left: 22, right: 22, top: 12, bottom: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    start.on("pointerover", () => start.setColor("#ffffff").setBackgroundColor("#2a3038"));
    start.on("pointerout", () => start.setColor("#f3f4f6").setBackgroundColor("#11151b"));
    start.on("pointerdown", () => this.scene.start("game"));

    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("game"));

    this.add.text(width / 2, height - 28, "ENTER ou clique para começar", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#59616c"
    }).setOrigin(0.5);
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
    this.dialogOpen = false;
    this.dialogStep = 0;
  }

  create() {
    this.worldW = 1800;
    this.worldH = 1100;
    this.cameras.main.setBackgroundColor("#d7dadd");
    this.physics.world.setBounds(0, 0, this.worldW, this.worldH);

    this.createGround();
    this.createForest();
    this.createSnow();

    this.player = this.physics.add.sprite(420, 760, "player");
    this.player.setScale(1.5);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(15, 18);
    this.player.body.setOffset(5, 12);

    this.fox = this.physics.add.staticImage(980, 535, "fox").setScale(1.65);
    this.fox.refreshBody();

    this.rune = this.physics.add.staticImage(1300, 350, "rune").setScale(1.25);
    this.rune.refreshBody();

    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.player, this.fox);
    this.physics.add.collider(this.player, this.rune);

    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.15);

    this.keys = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      interact: "E"
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createHUD();

    this.tweens.add({
      targets: this.fox,
      y: this.fox.y - 4,
      duration: 1350,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.fadeHint = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 22,
      "WASD / setas para andar  •  E para interagir",
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#e6e8eb",
        backgroundColor: "#11151bcc",
        padding: { left: 12, right: 12, top: 7, bottom: 7 }
      }
    ).setScrollFactor(0).setDepth(50).setOrigin(0.5);

    this.tweens.add({
      targets: this.fadeHint,
      alpha: 0,
      delay: 6500,
      duration: 1200
    });
  }

  createGround() {
    const bg = this.add.graphics();
    bg.fillStyle(0xc8ccd0, 1);
    bg.fillRect(0, 0, this.worldW, this.worldH);

    // Soft frozen paths.
    bg.fillStyle(0xb8bdc3, 0.55);
    bg.fillEllipse(650, 650, 920, 340);
    bg.fillEllipse(1120, 470, 720, 260);

    // Dark frozen pond as a future black/white puzzle area.
    bg.fillStyle(0x5e6670, 0.55);
    bg.fillEllipse(1360, 760, 560, 270);
    bg.lineStyle(3, 0xe8ebee, 0.22);
    bg.strokeEllipse(1360, 760, 530, 245);

    for (let i = 0; i < 80; i++) {
      bg.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.06, 0.18));
      bg.fillCircle(
        Phaser.Math.Between(20, this.worldW - 20),
        Phaser.Math.Between(20, this.worldH - 20),
        Phaser.Math.Between(1, 4)
      );
    }
  }

  createForest() {
    this.obstacles = this.physics.add.staticGroup();

    const trees = [
      [130,120],[260,170],[390,100],[520,160],[690,110],[850,150],[1010,105],[1180,155],[1360,100],[1540,160],[1690,115],
      [100,360],[165,520],[110,720],[200,930],
      [1710,340],[1640,500],[1710,700],[1600,930],
      [350,980],[520,1010],[710,955],[920,1015],[1120,970],[1330,1010],[1480,950],
      [550,420],[690,360],[800,300],[1170,300],[1480,380],[330,520],[290,690],[1500,590]
    ];

    trees.forEach(([x, y]) => {
      const tree = this.obstacles.create(x, y, "tree").setScale(1.7);
      tree.refreshBody();
      tree.body.setSize(22, 28);
      tree.body.setOffset(7, 25);
    });

    const rocks = [
      [470,650],[610,780],[820,620],[1110,680],[1220,520],[1420,590],[1040,850],[750,900]
    ];

    rocks.forEach(([x, y]) => {
      const rock = this.obstacles.create(x, y, "rock").setScale(1.3);
      rock.refreshBody();
    });
  }

  createSnow() {
    this.snowflakes = [];

    for (let i = 0; i < 110; i++) {
      const flake = this.add.circle(
        Phaser.Math.Between(0, GAME_WIDTH),
        Phaser.Math.Between(0, GAME_HEIGHT),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.25, 0.75)
      ).setScrollFactor(0).setDepth(40);

      flake.speed = Phaser.Math.FloatBetween(0.35, 1.15);
      flake.drift = Phaser.Math.FloatBetween(-0.22, 0.22);
      this.snowflakes.push(flake);
    }
  }

  createHUD() {
    this.prompt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 72, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#f5f5f5",
      backgroundColor: "#11151bdd",
      padding: { left: 13, right: 13, top: 8, bottom: 8 }
    }).setScrollFactor(0).setDepth(80).setOrigin(0.5).setVisible(false);

    this.dialogBg = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 95,
      Math.min(820, GAME_WIDTH - 48),
      116,
      0x0d1015,
      0.96
    ).setStrokeStyle(1, 0x68717c, 0.8)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);

    this.dialogName = this.add.text(100, GAME_HEIGHT - 137, "RAPOSA", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#aeb6c0",
      fontStyle: "bold",
      letterSpacing: 2
    }).setScrollFactor(0).setDepth(101).setVisible(false);

    this.dialogText = this.add.text(100, GAME_HEIGHT - 112, "", {
      fontFamily: "Georgia, serif",
      fontSize: "19px",
      color: "#f4f4f2",
      wordWrap: { width: 740 },
      lineSpacing: 5
    }).setScrollFactor(0).setDepth(101).setVisible(false);

    this.dialogContinue = this.add.text(GAME_WIDTH - 106, GAME_HEIGHT - 61, "E  ›", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#9099a5"
    }).setScrollFactor(0).setDepth(101).setVisible(false);
  }

  update() {
    for (const flake of this.snowflakes) {
      flake.y += flake.speed;
      flake.x += flake.drift;
      if (flake.y > GAME_HEIGHT + 4) {
        flake.y = -4;
        flake.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
      if (flake.x < -4) flake.x = GAME_WIDTH + 4;
      if (flake.x > GAME_WIDTH + 4) flake.x = -4;
    }

    if (this.dialogOpen) {
      this.player.setVelocity(0);
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        this.advanceDialog();
      }
      return;
    }

    const speed = 185;
    let vx = 0;
    let vy = 0;

    if (this.keys.left.isDown || this.cursors.left.isDown) vx -= 1;
    if (this.keys.right.isDown || this.cursors.right.isDown) vx += 1;
    if (this.keys.up.isDown || this.cursors.up.isDown) vy -= 1;
    if (this.keys.down.isDown || this.cursors.down.isDown) vy += 1;

    const v = new Phaser.Math.Vector2(vx, vy);
    if (v.lengthSq() > 0) {
      v.normalize().scale(speed);
      this.player.setVelocity(v.x, v.y);
      this.player.setFlipX(v.x < 0);
    } else {
      this.player.setVelocity(0);
    }

    const foxDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.fox.x,
      this.fox.y
    );

    const runeDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.rune.x,
      this.rune.y
    );

    if (foxDistance < 105) {
      this.prompt.setText("[ E ] conversar com a raposa").setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        this.startFoxDialog();
      }
    } else if (runeDistance < 95) {
      this.prompt.setText("[ E ] observar a pedra").setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        this.openSingleDialog(
          "PEDRA",
          "Há um símbolo gravado aqui. Parece importante... mas ainda não faz sentido."
        );
      }
    } else {
      this.prompt.setVisible(false);
    }
  }

  startFoxDialog() {
    this.dialogStep = 0;
    this.dialogLines = [
      ["RAPOSA", "Você finalmente chegou."],
      ["RAPOSA", "Este lugar perdeu quase todas as suas cores há muito tempo."],
      ["RAPOSA", "Se quiser encontrá-las de novo, vai precisar me seguir."],
      ["RAPOSA", "Mas cuidado... o inverno gosta de esconder respostas."]
    ];
    this.showDialogLine();
  }

  openSingleDialog(name, line) {
    this.dialogStep = 0;
    this.dialogLines = [[name, line]];
    this.showDialogLine();
  }

  showDialogLine() {
    const [name, line] = this.dialogLines[this.dialogStep];
    this.dialogOpen = true;
    this.prompt.setVisible(false);
    this.dialogBg.setVisible(true);
    this.dialogName.setText(name).setVisible(true);
    this.dialogText.setText(line).setVisible(true);
    this.dialogContinue.setVisible(true);
  }

  advanceDialog() {
    this.dialogStep += 1;

    if (this.dialogStep >= this.dialogLines.length) {
      this.dialogOpen = false;
      this.dialogBg.setVisible(false);
      this.dialogName.setVisible(false);
      this.dialogText.setVisible(false);
      this.dialogContinue.setVisible(false);
      return;
    }

    this.showDialogLine();
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#090b0f",
  pixelArt: true,
  antialias: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, GameScene]
};

new Phaser.Game(config);
