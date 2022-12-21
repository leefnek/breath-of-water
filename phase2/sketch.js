let sound, fft, peakDetect;

let time = 0;
let colorStep = 0;
let noiseValue = 0.4;
const particles = [];

function preload() {
  soundFormats("m4a", "ogg");
  sound = loadSound("./phase2.m4a");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(800, 1000, 0.35, 50);
}

function draw(_) {
  if (!sound.isPlaying()) return;
  translate(windowWidth / 2, windowHeight / 2);

  // particles
  var p = new Particle();
  particles.push(p);

  for (let i in particles) {
    const particle = particles[i];
    particle.update();
    particle.show();
    if (particle.edges()) {
      particles.splice(i, 1);
    }
  }
  // vertexes

  fft.analyze();
  peakDetect.update(fft);
  if (peakDetect.isDetected) {
    colorStep += 130;
  }

  const W = 720;
  rectMode(RADIUS);
  time += 0.005;
  noFill();
  colorMode(HSB);
  B = blendMode;
  B(BLEND);
  background(0, 0.03);
  B(ADD);
  beginShape(QUADS);
  for (let i = W; i; i--) {
    stroke(
      map((noise(i / W - time) * W + colorStep) % 360, 0, 360, 180, 260),
      70,
      W,
      0.2
    );
    vertex(
      (cos((R = (i * PI) / 6 + noise(i / W - time) * 20)) * i) / 2,
      (sin(R) * i) / 2
    );
  }
  endShape();
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(360);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(2, 4);
    this.color = `rgba(${parseInt(
      map(noiseValue * 100, 10, 50, 0, 100, true)
    )}, ${parseInt(map(noiseValue * 100, 10, 50, 50, 150, true))}, ${parseInt(
      map(noiseValue * 100, 0, 100, 150, 250)
    )}, 0.5)`;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    }
    return false;
  }
}
