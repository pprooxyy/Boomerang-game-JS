let interval;
let interval2;
class Game {
  constructor(characterSkin) {
    this.character = {
      box: document.querySelector(".player"),
      top: 200,
      left: 0,
      death: "url()",
    };
    this.weapon = {
      box: document.querySelector(".weapon"),
      top: this.character.top,
      left: this.character.left + 30,
    };
    this.enemy = {
      box: document.querySelectorAll(".monster"),
      top: Math.floor(Math.random() * 4) * 100,
      left: 420,
    };
    this.characterSkin = characterSkin;
    this.enemySkins = [
      `url("../character-img/enemy-2.png")`,
      `url("../character-img/enemy.png")`,
      `url("../character-img/enemy-3.png")`,
    ];
    this.gameContainer = document.getElementById("game-container");
    this.hidden = document.querySelector(".hidden-wrapper");
    this.spawnInterval = 2000;
    this.hasThrown = false;
    this.metMonster = false;
    this.countScore = 0;
    this.charDeath = false;
    this.upSpeed = 80;
  }

  updatePosition(updatedObject) {
    updatedObject.box.style.left = updatedObject.left + "px";
    updatedObject.box.style.top = updatedObject.top + "px";
  }

  startGame() {
    this.updatePosition(this.character);
    this.updatePosition(this.weapon);
    this.character.box.style.backgroundImage = this.characterSkin;
    this.hidden.style.visibility = "hidden";
    this.weapon.box.style.visibility = "visible";
    this.countDown();
  }

  moveCharLeft() {
    if (this.character.left > 0 && !this.charDeath) {
      if (this.weapon.left === this.character.left + 30) {
        this.character.left -= 40;
        this.weapon.left = this.character.left + 30;
      } else {
        this.character.left -= 40;
      }
      this.updatePosition(this.character);
      this.updatePosition(this.weapon);
    }
  }

  moveCharRight() {
    if (this.character.left < 400 && !this.charDeath) {
      if (this.weapon.left === this.character.left + 30) {
        this.character.left += 40;
        this.weapon.left = this.character.left + 30;
      } else {
        this.character.left += 40;
      }
      this.updatePosition(this.character);
      this.updatePosition(this.weapon);
    }
  }

  moveCharUp() {
    if (this.character.top > 0 && !this.charDeath) {
      this.character.top -= 50;
      this.weapon.top = this.character.top;
      this.updatePosition(this.character);
      this.updatePosition(this.weapon);
    }
  }

  mooveCharDown() {
    if (this.character.top < 400 && !this.charDeath) {
      this.character.top += 50;
      this.weapon.top = this.character.top;
      this.updatePosition(this.character);
      this.updatePosition(this.weapon);
    }
  }

  async throwBoomerang() {
    this.hasThrown = true;
    while (this.weapon.left <= 420) {
      this.weapon.left += 20;
      this.updatePosition(this.weapon);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (this.weapon.left >= 420) {
      while (this.weapon.left !== this.character.left + 30) {
        this.weapon.left -= 20;
        this.updatePosition(this.weapon);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      this.hasThrown = false;
    }
  }
  async monsterSpawn() {
    const monsterTopPosition = Math.floor(Math.random() * 5) * 100;
    const randomMonsterNumber = Math.floor(Math.random() * 3);
    const monster = document.createElement("div");
    monster.classList.add("monster");
    monster.style.backgroundImage = this.enemySkins[randomMonsterNumber];
    monster.style.top = monsterTopPosition + "px";
    this.gameContainer.appendChild(monster);

    let monsterLeftPosition = 400;

    interval = setInterval(async () => {
      if (
        monsterLeftPosition <= this.character.left &&
        monsterTopPosition >= this.character.top &&
        monsterTopPosition <= this.character.top + 50
      ) {
        this.endGame();
      } else if (monsterLeftPosition <= 0) {
        monster.remove();
        this.endGame();
      } else {
        monsterLeftPosition -= 10;
        monster.style.left = `${monsterLeftPosition}px`;
        if (
          monsterLeftPosition >= this.weapon.left &&
          this.hasThrown &&
          monsterTopPosition >= this.weapon.top &&
          monsterTopPosition <= this.weapon.top + 50
        ) {
          this.metMonster = true;
          clearInterval(interval);
          monster.style.backgroundImage = `url("../character-img/death.png")`;
          monster.style.height = "20px";
          monster.style.width = "20px";

          this.countScore += 1;
          const changeScore = document.querySelector("h4");
          changeScore.innerText = `SCORE: ${this.countScore}`;
        }
      }
    }, this.upSpeed);
  }

  endGame() {
    this.charDeath = true;
    this.character.box.style.backgroundImage = `url("../character-img/death.png")`;
    this.character.box.style.backgroundPosition = "center";
    this.weapon.box.style.visibility = "hidden";
    document.removeEventListener(
      "keydown",
      this.handleKeyPress.bind(this),
      false
    );
    clearInterval(interval);
    clearInterval(interval2);

    const gameOver = document.createElement("div");
    gameOver.setAttribute("id", "game-over");
    gameOver.innerText = "Game over";
    this.gameContainer.appendChild(gameOver);
  }

  autoSpawn() {
    interval2 = setInterval(() => {
      this.monsterSpawn();
      if (this.spawnInterval > 1000) {
        this.spawnInterval -= 300;
        this.upSpeed -= 5;
      }
    }, this.spawnInterval);
  }

  async countDown() {
    const countDown = document.createElement("div");
    countDown.classList.add("countdown");
    this.gameContainer.appendChild(countDown);
    let count = 3;
    const interval = setInterval(() => {
      countDown.innerText = count;
      count--;
      if (count < 0) {
        clearInterval(interval);
        countDown.remove();
        this.monsterSpawn();
        this.autoSpawn();
      }
    }, 1000);
  }

  handleKeyPress(event) {
    switch (event.keyCode) {
      case 65: // a
        this.moveCharLeft();
        break;
      case 87: // w
        this.moveCharUp();
        break;
      case 68: // d
        this.moveCharRight();
        break;
      case 83: // s
        this.mooveCharDown();
        break;
      case 32: // space
        if (this.weapon.left === this.character.left + 30) {
          this.throwBoomerang();
        }
        break;
    }
  }

  init() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this), false);
  }
}

const selectOptions = document.querySelectorAll(".select-hero");
selectOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const skin = button.outerText;
    const game = new Game(skin);
    game.startGame();
    game.init();
  });
});
