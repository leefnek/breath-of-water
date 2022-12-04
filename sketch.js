let sound;
let fft, amplitude, wave, currentTime;
// const waves = [];
let noiseValue = 0.4;
const particles = [];

const PHASE_1_STEP = {
  FIRST: [-200],
  SECOND: [-200, 0],
  THIRD: [-200, 0, 200],
};

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("./background.mp3");
}

function setup() {
  // canvas setting
  createCanvas(windowWidth, windowHeight);
  background(palette.black);
  angleMode(DEGREES);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(palette.black);
  translate(width / 2, height / 2);
  strokeWeight(2);

  wave = fft.waveform();
  currentTime = sound.currentTime();
  const level = amplitude.getLevel();
  if (!level) return;
  if (currentTime < 16.5) {
    phase1();
  } else {
    phase2();
  }
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
    noLoop();
  } else {
    sound.play();
    loop();
  }
}

function phase1() {
  noFill();
  const level = amplitude.getLevel() * 10;

  if (currentTime < 5) step = "FIRST";
  else if (currentTime < 9) step = "SECOND";
  else step = "THIRD";

  const color_palette = { 200: 38, 0: 120, "-200": 222 };

  steps = PHASE_1_STEP[step];
  for (let step of steps) {
    stroke(`rgba(75 , ${parseInt(color_palette[step])}, 255, ${noiseValue})`);
    for (let side of [-1, 1]) {
      beginShape();
      for (let degree = 0; degree <= 180; degree += 0.5) {
        const index = floor(map(degree, 0, width, 0, wave.length - 1));
        //min and maximum radius of the circle
        const r = map(wave[index], -1, 1, 150, 350);
        const x = (r + step) * sin(degree) * side;
        const y = (r + step) * cos(degree);
        vertex(x, y);
      }
      endShape();
    }
  }

  noiseValue = noise(level + currentTime);
}

function phase2() {
  const level = amplitude.getLevel() * 10;

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

  noFill();
  stroke(
    `rgb(${parseInt(map(noiseValue * 100, 10, 50, 0, 100, true))}, ${parseInt(
      map(noiseValue * 100, 10, 50, 50, 150, true)
    )}, ${parseInt(map(noiseValue * 100, 0, 100, 150, 255))})`
  );
  for (let side of [-1, 1]) {
    beginShape();
    for (let degree = 0; degree <= 180; degree += 0.5) {
      const index = floor(map(degree, 0, width, 0, wave.length - 1));
      //min and maximum radius of the circle
      const r = map(wave[index], -1, 1, 150, 350);
      const x = r * sin(degree) * side;
      const y = r * cos(degree);
      vertex(x, y);
    }
    endShape();
  }

  noiseValue = noise(level);
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3, 5);
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
