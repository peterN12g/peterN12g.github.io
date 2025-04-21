let port;
let connectButton;
let ledButton;
let buttonStatus = "";
let backgroundColor;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);

  port = createSerial();

  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);

  ledButton = createButton("Toggle LED on Pin 13");
  ledButton.mousePressed(toggleLED);

  backgroundColor = color(220);
}

function draw() {
  background(backgroundColor);

  let str = port.readUntil("\n");
  if (str !== "") {
    buttonStatus = str.trim();

    let val = Number(buttonStatus);
    if (!isNaN(val)) {
      let hue = map(val, 0, 1023, 0, 360);
      backgroundColor = color(hue, 255, 255);
    }
  }

  fill(0);
  textSize(16);
  text("Potentiometer: " + buttonStatus, 20, 30);
}

function connectToSerial() {
  port.open('Arduino', 9600);
}

function toggleLED() {
  if (port.opened()) {
    port.write("TOGGLE_LED\n");
  }
}
