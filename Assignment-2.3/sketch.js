let osc, noise1, noise2, filt1, filt2, img;
let showImage = false;

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

  if (showImage) {
    image(img, 0, 0, width, height);
  } else {
    text("click mouse", width/2, height/2);
  }
}

function mousePressed() {
  showImage = true;
}

function mouseReleased() {
  showImage = false;
}
