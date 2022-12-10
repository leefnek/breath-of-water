let sound, fft, peakDetect;
let n = 3000;
let i = 0;
let a = [];
let r = 0;
let b = [];

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("../background.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (i = 0; i < n * 2; i++) {
    a[i] = random(660) - 330;
  }
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(500, 800);
}
function draw() {
  if (!sound.isPlaying()) return;
  background(0);
  stroke(255);

  fft.analyze();
  peakDetect.update(fft);

  for (i = 0; i < n * 2 - 1; i++) {
    push();
    translate(a[i], a[i + 1], 60 * sin(mag(a[i], a[i + 1]) / 30 - r));
    stroke(0, random(100, 200), random(100, 250));
    strokeWeight(5);
    point(0, 0);
    //15=>1=>172의 반복
    b.push(mag(a[i], a[i + 1]) / 30);
    pop();
  }
  r += peakDetect.isDetected ? 0.6 : 0.1;
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
