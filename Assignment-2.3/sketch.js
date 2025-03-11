let osc, noise1, noise2, filt1, filt2, img;

function preload() {
  img = loadImage("media/splash.png");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("click mouse", width/2, heightClar/2);
}

function mousePressed() {
  image(img, 0, 0, width, height);
}

function mouseReleased() {
  background(220);
  text("click mouse", width / 2, height / 2);
}