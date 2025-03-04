let basicSynth, synthButton;

function setup() {
  createCanvas(400, 400);
  basicSynth = new Tone.Synth().toDestination();
  synthButton = createButton("Play Synth");
  synthButton.position(height/6,width/6);
  synthButton.mousePressed(() => {basicSynth.triggerAttackRelease("C4",1)});
}

function draw() {
  background(220);
}
