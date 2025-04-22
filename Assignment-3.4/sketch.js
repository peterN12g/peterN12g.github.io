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
let missedNoise, missedFilter, missedEnv, backgroundMusic, backgroundSynth, speedLFO, startMusic, endMusic, skitter, port, xCross, yCross, xMov, yMov;
let dirX = 0, dirY = 0;

function preload() {
  port = createSerial();
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  bugImage = loadImage("media/bug-sprite.png");
  squish = new Tone.Player("media/squish.mp3").toDestination();
  skitter = new Tone.Player("media/skitter.mp3").toDestination();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);
  frameRate(120);
  xCross = windowWidth/2;
  yCross = windowHeight/2;

  const backgroundRev = new Tone.Reverb(1).toDestination();
  backgroundSynth = new Tone.PolySynth(Tone.Synth).connect(backgroundRev);
  backgroundMusic = new Tone.Part((time, note) => {
    backgroundSynth.triggerAttackRelease(note, "12n", time);
  }, [
    ["0.00m", "C4"],
    ["0.50m", "C4"],
    ["1.00m", "G4"],
    ["1.50m", "G4"],
    ["2.00m", "A4"],
    ["2.50m", "A4"],
    ["3.00m", "G4"],
    ["3.50m", "F4"],
    ["4.00m", "F4"],
    ["4.50m", "E4"],
    ["5.00m", "E4"],
    ["5.50m", "D4"],
    ["6.00m", "D4"],
    ["6.50m", "C4"],
    ["7.00m", "G4"],
    ["7.50m", "G4"],
    ["8.00m", "F4"],
    ["8.50m", "F4"],
    ["9.00m", "E4"],
    ["9.50m", "E4"],
    ["10.00m", "D4"],
    ["10.50m", "D4"],
    ["11.00m", "C4"],
  ]);
  backgroundMusic.loopEnd = 10;
  backgroundMusic.loop = true;

  startMusic = new Tone.Part((time, note) => {
    backgroundSynth.triggerAttackRelease(note, "16n", time);
  }, [
    ["0.00m", "C4"],
    ["0.50m", "E4"],
    ["1.00m", "G4"],
    ["1.50m", "C5"],
    ["2.00m", "G4"],
    ["2.50m", "E4"],
    ["3.00m", "C4"],
    ["3.50m", "F4"],
    ["4.00m", "A4"],
    ["4.50m", "C5"],
    ["5.00m", "F4"],
    ["5.50m", "A4"],
    ["6.00m", "G4"],
    ["6.50m", "C5"],
    ["7.00m", "E4"],
    ["7.50m", "G4"],
    ["8.00m", "C5"],
    ["8.50m", "F4"],
    ["9.00m", "A4"],
    ["9.50m", "C5"],
    ["10.00m", "F4"],
    ["10.50m", "G4"],
    ["11.00m", "C4"],
  ]);
  startMusic.loopEnd = 10;
  startMusic.loop = true;

  endMusic = new Tone.Part((time, note) => {
    backgroundSynth.triggerAttackRelease(note, "16n", time);
  }, [
    ["0.00m", "C4"],
    ["0.25m", "D4"],
    ["0.50m", "E4"],
    ["0.75m", "F4"],
    ["1.00m", "G4"],
    ["1.25m", "A4"],
    ["1.50m", "B4"],
    ["1.75m", "C5"],
    ["2.00m", "D5"],
    ["2.25m", "E5"],
    ["2.50m", "F5"],
    ["2.75m", "G5"],
    ["3.00m", "A5"],
    ["3.25m", "B5"],
    ["3.50m", "C6"],
    ["3.75m", "D6"],
    ["4.00m", "E6"],
  ]);
  endMusic.loopEnd = 4;
  endMusic.loop = true;
  Tone.Transport.start();
  
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

  const info = port.readUntil('\n');
  frameRateMultiplier = 1 + Math.floor(score / 3);
  speedMultiplier = 1 + Math.floor(score / 6);
  Tone.Transport.bpm.value = 80 + speedMultiplier * 20;

  switch (gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width / 2, height / 2);
      startMusic.start(Tone.now());
      break;
    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, 15, 15);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - 15, 15);
      startMusic.stop();

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
        backgroundMusic.stop();
        skitter.stop();
      } else {
        time -= deltaTime / 1000;
        if (time <= 0) {
          gameState = GameStates.END;
          backgroundMusic.stop();
          skitter.stop();
        }
      }
      if (info && info.startsWith('joystart')) {
        const values = info.slice(8).split(',');
        if (values.length === 2) {
          const x = Number(values[0]);
          const y = Number(values[1]);
          if (!isNaN(x) && !isNaN(y)) {
            dirX = Math.abs(x) < 0.1 ? 0 : x;
            dirY = Math.abs(y) < 0.1 ? 0 : y;
          }
        }
      } else if (info && info.startsWith('press')) {
        squashBug();
      }
      xCross += dirX * 4;
      yCross += dirY * 4;
      stroke(0);
      // strokeWeight(2);
      line(xCross - 20, yCross, xCross + 20, yCross);
      line(xCross, yCross - 20, xCross, yCross + 20);
      break;
    case GameStates.END:
      textAlign(CENTER, CENTER);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Score: " + score, width / 2, height / 2);
      if (score > highScore) highScore = score;
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      text("Reload the Page to Play Again!", width / 2, height / 2 + 40);
      endMusic.start(Tone.now());
      backgroundMusic.stop(); 
      break;
  }
}

function mousePressed() {
  if (gameState !== GameStates.PLAY) return;
  skitter.start();
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
      squish.start();
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
    connectPort();
    gameState = GameStates.PLAY;
    backgroundMusic.start(Tone.now());
    Tone.start();
    startMusic.start(Tone.now());
  }
}

function connectPort(){
  port.open('Arduino', 9600);
}

function squashBug() {
  for (let bug of bugs) {
    if (!bug.squashed &&
        xCross >= bug.x && xCross <= bug.x + spriteWidth &&
        yCross >= bug.y && yCross <= bug.y + spriteHeight) {
      bug.squashed = true;
      squish.start();
      score++;
      port.write("buzz\n");
      break;
    }
  }
}
