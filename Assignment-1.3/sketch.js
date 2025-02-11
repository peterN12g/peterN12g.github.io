let characters = [];
let sprites = {};

function preload() {
  sprites.cyclops = loadImage("media/cyclops.png");
  sprites.ninja = loadImage("media/ninja.png");
  sprites.robot = loadImage("media/robot.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  let positions = [];

  function preventSpriteOverlap() {
    let x, y, overlapping;
    do {
      x = random(80, width - 80);
      y = random(80, height - 80);
      overlapping = positions.some(pos => dist(x, y, pos.x, pos.y) < 80);
    } while (overlapping);
    
    positions.push({ x, y });
    return { x, y };
  }

  let cyclopsPos = preventSpriteOverlap();
  let ninjaPos = preventSpriteOverlap();
  let robotPos = preventSpriteOverlap();

  let cyclops = new Character("Cyclops", cyclopsPos.x, cyclopsPos.y, sprites.cyclops);
  let ninja = new Character("Ninja", ninjaPos.x, ninjaPos.y, sprites.ninja);
  let robot = new Character("Robot", robotPos.x, robotPos.y, sprites.robot);
  characters.push(cyclops, ninja, robot);
}

function draw() {
  background(220);

  for (let char of characters) {
    char.draw();
  }
}

function keyPressed() {
  let direction = getDirection();
  if (direction) {
    for (let char of characters) {
      char.currentAnimation = direction;
    }
  }
}

function keyReleased() {
  for (let char of characters) {
    char.currentAnimation = "stand";
  }
}

function getDirection() {
  switch (keyCode) {
    case LEFT_ARROW: return "left";
    case RIGHT_ARROW: return "right";
    default: return null;
  }
}

class Character {
  constructor(name, x, y, sprite) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.currentAnimation = "stand";
    this.animations = {};

    this.setupAnimations();
  }

  setupAnimations() {
    this.addAnimation("stand", new SpriteAnimation(this.sprite, 0, 0, 1));
    this.addAnimation("right", new SpriteAnimation(this.sprite, 0, 0, 6));
    
    let walkLeft = new SpriteAnimation(this.sprite, 0, 0, 6);
    walkLeft.flipped = true;
    this.addAnimation("left", walkLeft);
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch (this.currentAnimation) {
        case "right":
          this.x += 2;
          break;
        case "left":
          this.x -= 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = (this.flipped) ? -1 : 1;
    scale(s,1);
    image(this.spritesheet, 0, 0, 80, 80, this.u*80, this.v*80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 10 === 0)
      this.u++;

    if (this.u === this.startU + this.duration)
      this.u = this.startU;
  }
}