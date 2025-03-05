let synth1, filt, rev, polySynth, noise1, ampEnv1, filt1, lfo;
let filterSlider, reverbSlider, detuneSlider, noiseVolSlider;
let activeKey = null;
let lfoEnabled = true;
let lfoWasActive = true;

let keyNotes = {
  'a': 'A3', 
  's': 'B3', 
  'd': 'C4', 
  'f': 'D4',
  'g': 'E4', 
  'h': 'F4', 
  'j': 'G4', 
  'k': 'A4'
};
let keyNotes1 = {
  'q': 'D3', 
  'w': 'F3', 
  'e': 'A3', 
  'r': 'C4',
  't': 'E4', 
  'y': 'G4', 
  'u': 'B4'
};

function setup() {
  createCanvas(400, 400);
  filt = new Tone.Filter(1500, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  lfo = new Tone.LFO(2, 200, 2000).start();
  lfo.connect(filt.frequency);
  synth1 = new Tone.Synth({
    envelope: { 
      attack: 0.1, 
      decay: 0.2, 
      sustain: 0.9, 
      release: 0.3 
    }
  }).connect(rev);
  synth1.portamento.value = 0.05;
  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.set({
    envelope: { 
      attack: 0.1, 
      decay: 0.1, 
      sustain: 1, 
      release: 0.2 
    },
    oscillator: { 
      type: 'sawtooth' 
    }
  });
  polySynth.volume.value = -6;
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1, 
    decay: 0.3, 
    sustain: 0.5, 
    release: 0.2
  }).toDestination();
  filt1 = new Tone.Filter(1500, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(filt1);
  noise1.volume.value = -20;

  filterSlider = createSlider(200, 5000, 1500);
  filterSlider.position(20, 250);
  filterSlider.input(() => {
    filt.frequency.value = filterSlider.value();
    disableLFO();
  });
  reverbSlider = createSlider(0, 5, 2, 0.1);
  reverbSlider.position(200, 250);
  reverbSlider.input(() => {
    rev.decay = reverbSlider.value();
  });
  detuneSlider = createSlider(-100, 100, 0);
  detuneSlider.position(20, 320);
  detuneSlider.input(() => {
    polySynth.set({ detune: detuneSlider.value() });
  });
  noiseVolSlider = createSlider(-40, 0, -20);
  noiseVolSlider.position(200, 320);
  noiseVolSlider.input(() => {
    noise1.volume.value = noiseVolSlider.value();
  });
  document.addEventListener("mouseup", enableLFO);
}

function draw() {
  background(220);
  textSize(16);
  text("Monophonic Synth (A-K)", 20, 20);
  text("Polyphonic Synth (Q-U)", 20, 40);
  text("Noise (Z)", 20, 60);
  text("Filter Cutoff", 20, 240);
  text("Reverb Decay", 200, 240);
  text("Detune (PolySynth)", 20, 310);
  text("Noise Volume", 200, 310);
}

function disableLFO() {
  if (lfoEnabled) {
    lfo.disconnect();
    lfoWasActive = true;
    lfoEnabled = false;
  }
}

function enableLFO() {
  if (!lfoEnabled && lfoWasActive) {
    lfo.connect(filt.frequency);
    lfoEnabled = true;
  }
}

function keyPressed(event) {
  let key = event.key.toLowerCase();
  let pitch = keyNotes[key];
  let pitch1 = keyNotes1[key];

  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  } else if (pitch1) {
    polySynth.triggerAttack(pitch1);
  } else if (key === "z") {
    ampEnv1.triggerAttack();
  }
}

function keyReleased(event) {
  let key = event.key.toLowerCase();
  let pitch1 = keyNotes1[key];

  if (key === activeKey) {
    synth1.triggerRelease();
    activeKey = null;
  } else if (pitch1) {
    polySynth.triggerRelease(pitch1);
  } else if (key === "z") {
    ampEnv1.triggerRelease();
  }
}
