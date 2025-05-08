let score = 0;
let lives = 3;
let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end",
});
let gameState = GameStates.START;
let highScore = 0;
let gameFont, neutralTarget, damageTarget, healthTarget;
let targets = [];
const spriteWidth = 160;
const spriteHeight = 160;
let frameRateMultiplier = 1;
let speedMultiplier = 1;
let missedNoise, missedFilter, missedEnv, backgroundMusic, backgroundSynth, speedLFO, startMusic, endMusic, port, xCross, yCross, xMov, yMov;
let dirX = 0, dirY = 0;

function preload() {
  port = createSerial();
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
  neutralTarget = loadImage("media/Neutral_Target.png");
  damageTarget = loadImage("media/Damage_Target.png");
  healthTarget = loadImage("media/Health_Target.png");
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
      text("Lives: " + lives, width - 15, 15);
      startMusic.stop();

      if (lives > 3) lives = 3;
      let activeTargets = targets.filter(target => !target.squashed).length;
      let spawnRate, minLifetime, maxLifetime, neutralThreshold, damageThreshold;
      if (score < 10) {
        spawnRate = 0.02;
        minLifetime = 3000;
        maxLifetime = 5000;
        neutralThreshold = 10;
        damageThreshold = 15;
      } else if (score < 20) {
        spawnRate = 0.03;
        minLifetime = 2500;
        maxLifetime = 4000;
        neutralThreshold = 8;
        damageThreshold = 14;
      } else if (score < 30) {
        spawnRate = 0.04;
        minLifetime = 2000;
        maxLifetime = 3000;
        neutralThreshold = 6;
        damageThreshold = 13;
      } else {
        spawnRate = 0.05;
        minLifetime = 1500;
        maxLifetime = 2500;
        neutralThreshold = 5;
        damageThreshold = 13;
      }

      if (random() < spawnRate && activeTargets < 10) {
        let x = random(width - spriteWidth);
        let y = random(height - spriteHeight);
        let typeRoll = random(17);
        let type, image;
        if (typeRoll < neutralThreshold) {
          type = "neutral";
          image = neutralTarget;
        } else if (typeRoll < damageThreshold) {
          type = "damage";
          image = damageTarget;
        } else {
          type = "health";
          image = healthTarget;
        }
        targets.push({
          x,
          y,
          squashed: false,
          currentFrame: 0,
          spawnTime: millis(),
          lifetime: random(minLifetime, maxLifetime),
          squashTime: null,
          type: type,
          image: image
        });
      }

      for (let i = targets.length - 1; i >= 0; i--) {
        let target = targets[i];
        if (!target.squashed) {
          if (frameCount % Math.max(1, 10 - frameRateMultiplier) === 0) {
            target.currentFrame = (target.currentFrame + 1) % 1;
          }
          
          if (millis() - target.spawnTime > target.lifetime && !target.squashed) {
            targets.splice(i, 1);
            continue;
          }
          
          image(target.image, target.x, target.y, spriteWidth, spriteHeight, 
                target.currentFrame * spriteWidth, 0, spriteWidth, spriteHeight);
        } else {
          if (millis() - target.squashTime > 3000) {
            targets.splice(i, 1);
            continue;
          }
          image(target.image, target.x, target.y, spriteWidth, spriteHeight, 
                1 * spriteWidth, 0, spriteWidth, spriteHeight);
        }
      }

      if (lives <= 0) {
        gameState = GameStates.END;
        backgroundMusic.stop();
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
        hit();
      }
      xCross += dirX * 6;
      yCross += dirY * 6;
      stroke(0);
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

function hit() {
  let hitTarget = false;

  for (let target of targets) {
    if (!target.squashed &&
        xCross >= target.x && xCross <= target.x + spriteWidth &&
        yCross >= target.y && yCross <= target.y + spriteHeight) {
      target.squashed = true;
      target.squashTime = millis();
      if (target.type === "neutral") {
        score++;
        port.write("dong\n");
      } else if (target.type === "damage") {
        lives--;
        port.write("ding\n");
      } else if (target.type === "health") {
        lives++;
      }
      hitTarget = true;
      port.write("buzz\n");
      break;
    }
  }

  if (!hitTarget) {
    lives--; // Lose a life on miss
    missedNoise.start();
    missedEnv.triggerAttackRelease(0.2);
    port.write("ding\n");
  }
}