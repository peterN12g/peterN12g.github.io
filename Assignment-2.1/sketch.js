let startContext, samples, sampler, catButton, cowButton, dogButton, duckButton, delTimeSlider, feedbackSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(1).toDestination();
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
del.wet.value = 0.5;

function preload() {
  samples = new Tone.Players({
    cat: "media/cat-meowing.mp3",
    cow: "media/cow-mooing.mp3",
    dog: "media/dog-bark.mp3",
    duck: "media/duck-quack.mp3"
  }).connect(del)
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(120,0);
  startContext.mousePressed(startAudioContext)
  catButton = createButton("Cat Sound");
  catButton.position(20,30);
  catButton.mousePressed(() => {samples.player("cat").start()});
  cowButton = createButton("Cow Sound");
  cowButton.position(110,30);
  cowButton.mousePressed(() => {samples.player("cow").start()});
  dogButton = createButton("Dog Sound");
  dogButton.position(200,30);
  dogButton.mousePressed(() => {samples.player("dog").start()});
  duckButton = createButton("Duck Sound");
  duckButton.position(290,30);
  duckButton.mousePressed(() => {samples.player("duck").start()});
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 100);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});
  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 100);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});
  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 200);
  distSlider.input(() => {dist.distortion = distSlider.value()});
  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200,200);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 90);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 90);
  text("Distorition Amount: " + distSlider.value(), 15, 190);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 190);
}

function startAudioContext() {
  if(Tone.context.state != 'running') {
    Tone.start();
    console.log("Running");
  } else {
    console.log("Already running.");
  }
}
