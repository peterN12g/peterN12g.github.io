let osc, noise, filt, lfo, env, reverb, img, polySynth;
let showImage = false;

function preload() {
  img = loadImage("media/splash.png");
}

function setup() {
  createCanvas(400, 400);

  osc = new Tone.Oscillator({ type: "sine", frequency: 200 });
  noise = new Tone.Noise("white");
  filt = new Tone.Filter(800, "lowpass");
  env = new Tone.AmplitudeEnvelope({ attack: 0.05, decay: 0.1, sustain: 0.3, release: 0.2 }).toDestination();
  reverb = new Tone.Reverb(1.5).toDestination();
  lfo = new Tone.LFO(5, 400, 1200).start();

  polySynth = new Tone.PolySynth(Tone.Synth).connect(reverb);
  polySynth.set({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.1
    },
    oscillator: {
      type: "sawtooth"
    }
  });

  lfo.connect(filt.frequency);
  lfo.connect(osc.frequency);
  noise.connect(filt);
  filt.connect(env);
  osc.connect(env);
  env.connect(reverb);
}

function draw() {
  background(220);
  textSize(16);
  textAlign(CENTER, CENTER);

  if (showImage) {
    image(img, 0, 0, width, height);
  } else {
    text("click mouse", width / 2, height / 2);
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    showImage = true;
    let usePolySynth = Math.random() > 0.2; //incorp possibility of polysynth noise

    if (usePolySynth) {
      polySynth.triggerAttackRelease("C4", "8n");
    } else {
      osc.start();
      noise.start();
      env.triggerAttack();
      osc.frequency.setValueAtTime(200, Tone.now());
      osc.frequency.exponentialRampToValueAtTime(1000, Tone.now() + 0.2);
      noise.start();
      setTimeout(() => noise.stop(), 200);
      setTimeout(() => {
        osc.stop();
      }, 300);
    }
    noise.start();
    setTimeout(() => noise.stop(), 200);
  }
}

function mouseReleased() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    showImage = false;
    env.triggerRelease();
    setTimeout(() => {
      osc.stop();
      noise.stop();
    }, 300);
  }
}
