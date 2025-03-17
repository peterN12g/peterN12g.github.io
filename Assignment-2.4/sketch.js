let score = 0;
let time = 30;
let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end",
});
let gameState = GameStates.START;
let highScore = 0;
let gameFont, bugImage;
var bugs = [];
let count = Math.floor(Math.random() * (55 - 40 + 1)) + 40;
const spriteWidth = 80;
const spriteHeight = 80;
const bugSpeed = 50;
let frameRateMultiplier = 1;
let speedMultiplier = 1;
let backgroundMusic;

let squishOsc, squishEnv; //todo
let missedNoise, missedFilter, missedEnv;

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugImage = loadImage("media/bug-sprite.png");

  backgroundMusic = new Tone.Player("media/background.mp3").toDestination();
  backgroundMusic.loop = true;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);
  frameRate(120);

  for (let i = 0; i < count; i++) {
    let x = random(width - spriteWidth);
    let y = random(height - spriteHeight);
    bugs.push({
      x,
      y,
      squashed: false,
      currentFrame: 0,
      yDirection: random() > 0.5 ? 1 : -1,
    });
  }

  missedNoise = new Tone.Noise("white");
  missedFilter = new Tone.Filter({
    frequency: 1200,
    type: "bandpass",
  });
  missedEnv = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  });

  missedNoise.connect(missedFilter);
  missedFilter.connect(missedEnv);
  missedEnv.toDestination();
}

function draw() {
  background(220);

  frameRateMultiplier = 1 + Math.floor(score / 3);
  speedMultiplier = 1 + Math.floor(score / 6);

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      break;
    case GameStates.PLAY:
      if (!backgroundMusic.state === "started") {
        backgroundMusic.start();
      }
      textAlign(LEFT, TOP);
      text("Score: " + score, 15, 15);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - 15, 15);

      for (let bug of bugs) {
        if (!bug.squashed) {
          if (frameCount % Math.max(1, 10 - frameRateMultiplier) === 0) {
            bug.currentFrame = (bug.currentFrame + 1) % 9;
          }
          bug.y += bug.yDirection * bugSpeed * speedMultiplier * deltaTime / 1000;
          if (bug.y < 0) {
            bug.y = 0;
            bug.yDirection = 1;
          }
          if (bug.y + spriteHeight > height) {
            bug.y = height - spriteHeight;
            bug.yDirection = -1;
          }
          if (bug.yDirection === 1) {
            push();
            scale(1, -1);
            image(bugImage, bug.x, -bug.y - spriteHeight, spriteWidth, spriteHeight, bug.currentFrame * spriteWidth, 0, spriteWidth, spriteHeight);
            pop();
          } else {
            image(bugImage, bug.x, bug.y, spriteWidth, spriteHeight, bug.currentFrame * spriteWidth, 0, spriteWidth, spriteHeight);
          }
        } else {
          image(bugImage, bug.x, bug.y, spriteWidth, spriteHeight, 9 * spriteWidth, 0, spriteWidth, spriteHeight);
        }
      }

      if (score === count) {
        gameState = GameStates.END;
      } else {
        time -= deltaTime / 1000;
        if (time <= 0) {
          gameState = GameStates.END;
        }
      }
      break;
    case GameStates.END:
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Reload the Page to Play Again!", width / 2, height / 2 + 40);
      if (backgroundMusic.state === "started") {
        backgroundMusic.stop();
      }
      break;
  }
}

function mousePressed() {
  if (gameState !== GameStates.PLAY) return;

  let hitBug = false;

  for (let bug of bugs) {
    if (
      mouseX > bug.x &&
      mouseX < bug.x + spriteWidth &&
      mouseY > bug.y &&
      mouseY < bug.y + spriteHeight &&
      !bug.squashed
    ) {
      bug.squashed = true;
      score++;
      hitBug = true;
      break;
    }
  }

  if (!hitBug) {
    missedNoise.start();
    missedEnv.triggerAttackRelease(0.2);
  }
}

function keyPressed() {
  if (keyCode === ENTER && gameState === GameStates.START) {
    gameState = GameStates.PLAY;
  }
}
