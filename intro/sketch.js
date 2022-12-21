let sound, amplitude;
let cols, rows;
let scl = 20;

let randomValue = 0;
let terrain = [];

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("./waves.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  amplitude = new p5.Amplitude();
  cols = parseInt(width / scl);
  rows = parseInt(height / scl + 15);

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0;
    }
  }
}

function draw() {
  if (!sound.isPlaying()) return;
  const level = amplitude.getLevel();

  randomValue -= random(0.3, 0.6);
  var yoff = randomValue;
  var xoff;

  for (var y = 1; y < rows; y++) {
    xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = terrain[x][y - 1] + map(noise(xoff, yoff), 0, 1, -10, 10);
      xoff += 0.1;
    }
    yoff += 0.2;
  }

  for (var x = 0; x < cols; x++) {
    terrain[x][0] =
      map(level, 0, 1, -140, 180) + map(noise(xoff, yoff), 0, 1, -10, 10);
  }

  background(0);
  noFill();

  translate(0, -370);
  rotateX(PI / 5);
  frameRate(10);
  translate(-width / 2, -height / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);

    for (var x = 0; x < cols; x++) {
      stroke(0, random(150, 200), random(150, 250));
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
