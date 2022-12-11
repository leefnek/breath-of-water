let sound, fft, peakDetect;
let n = 3000;
let i = 0;
let points = [];
let r = 0;
let colorStep = 0;

const color = [
  "#025373",
  "#03738C",
  "#3FA8BF",
  "#96D2D9",
  "#346173",
  "#A9CBD9",
  "#04D9D9",
  "#04D9C4",
  "#6CD9CE",
];

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("../background.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (i = 0; i < n * 2; i++) {
    points[i] = random(660) - 330;
  }
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(20, 300, 0.35, 20);
}
function draw() {
  if (!sound.isPlaying()) return;
  background(0);
  stroke(255);

  fft.analyze();
  peakDetect.update(fft);
  for (i = 0; i < n * 2 - 1; i++) {
    push();
    const tValue = sin(mag(points[i], points[i + 1]) / 30 - r);
    translate(
      points[i],
      points[i + 1],
      //15=>1=>172의 반복
      60 * tValue
    );
    stroke(color[colorStep]);
    strokeWeight(5);
    point(0, 0);
    pop();
  }
  if (peakDetect.isDetected) {
    r += 0.6;
    colorStep = parseInt(random(color.length));
  } else {
    r += 0.1;
  }
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
