let pallet = [];
let colors = ["red", "orange", "yellow", "green", "cyan", "blue", "magenta", [139, 69, 19], "white", "black"];
let prevX, prevY;
let thickness;
let locked = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  for(let i = 0; i < colors.length; i++) {
    let box = new colorBox(i, colors[i]);
    pallet.push(box);
  }

  thickness = createSelect();
  thickness.position(20, colors.length * 50 + 40);
  thickness.style("padding", "5px");

  for(let i = 1; i<=5; i++) {
    thickness.option(i);
  }
}

function draw() {
  for(let box of pallet) {
    box.appear();
  }

  textSize(25);
  text("select thickness", 10, colors.length * 50 + 30);


  if(mouseIsPressed) {
    if(mouseX > 60) {
      stroke(selectedColor);
      strokeWeight(thickness.value());
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }  
  prevX = mouseX;
  prevY = mouseY;
}

function mousePressed() {
  if (!locked) {
    for (let box of pallet) {
      if (mouseX > box.x && mouseX < box.x + 50 && mouseY > box.y && mouseY < box.y + 50) {
        selectedColor = box.color;
        colorLocked = true;
        return;
      }
    }
  }
}

class colorBox {
  constructor(pos, color) {
    this.x = 0;
    this.y = pos * 50;
    this.color = color;
  }
  appear() {
    fill(this.color);
    stroke(0);
    rect(this.x, this.y, 50, 50);
  }
}
