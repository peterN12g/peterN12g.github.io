function setup() {
  createCanvas(windowWidth, windowHeight);
}

// resizes background for different screen sizes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  // use of window size to dynamically change between screen sizes 
  stroke(0);
  fill(50, 205, 50);
  rect(0, 0, width / 2, height / 2);

  fill(255);
  rect(width / 2, 0, width / 2, height / 2);

  fill(0);
  rect(0, height / 2, width / 2, height / 2);

  fill(255);
  rect(width / 2, height / 2, width / 2, height / 2);

  // Example 1
  fill(255);
  circle(width * 0.125, height * 0.25, min(width, height) * 0.45);
  square(width * 0.275, height * 0.05, min(width, height) * 0.4);

  // Example 2
  noStroke(); // remove outline for example 3
  fill(255, 0, 0, 64);
  circle(width * 0.775, height * 0.175, min(width, height) * 0.3);

  fill(0, 0, 255, 64);
  circle(width * 0.72, height * 0.325, min(width, height) * 0.3);

  fill(50, 205, 50, 64);
  circle(width * 0.825, height * 0.325, min(width, height) * 0.3);

  // Example 3
  fill(255, 255, 50);
  arc(width * 0.125, height * 0.75, min(width, height) * 0.35, min(width, height) * 0.35, radians(-135), radians(135));


  fill(255, 0, 0);
  arc(width * 0.35, height * 0.75, min(width, height) * 0.4, min(width, height) * 0.38, radians(180), radians(360));
  rect(width * 0.35 -  min(width, height) * 0.2, height * 0.74, min(width, height) * 0.4, height * 0.2);

  fill(255);
  circle(width * 0.31, height * 0.7, min(width, height) * 0.1);
  circle(width * 0.39, height * 0.7, min(width, height) * 0.1);

  fill(0, 0, 250);
  circle(width * 0.31, height * 0.7, min(width, height) * 0.055);
  circle(width * 0.39, height * 0.7, min(width, height) * 0.055);

  // Example 4
  stroke(255); // re-add outline
  strokeWeight(5); // make shape outline thick
  fill(0, 0, 120);
  square(width * 0.65, height * 0.55, min(width, height) * 0.4);

  fill(50, 165, 50);
  circle(width * 0.75, height * 0.75, min(width, height) * 0.2);

  fill(255, 0, 0);
  beginShape();
  vertex(width * 0.75, height * 0.64);
  vertex(width * 0.7675, height * 0.72);
  vertex(width * 0.8075, height * 0.72);
  vertex(width * 0.7725, height * 0.77);
  vertex(width * 0.7875, height * 0.85);
  vertex(width * 0.7525, height * 0.79);
  vertex(width * 0.7175, height * 0.85);
  vertex(width * 0.7325, height * 0.77);
  vertex(width * 0.6975, height * 0.72);
  vertex(width * 0.7375, height * 0.72);
  endShape(CLOSE);  

  strokeWeight(1);
}