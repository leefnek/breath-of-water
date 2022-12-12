let sound,
  fft,
  peakDetect,
  frame = 60;
let a, b;

let colorStep = 0;

function preload() {
  soundFormats("m4a", "ogg");
  sound = loadSound("./phase3.m4a");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  layer = createGraphics(windowWidth, windowHeight);
  background("black");

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(500, 1000, 0.35, 50);

  a = 720 / (sound.duration() * frame);
  b = a;

  frameRate(frame);
}

function draw() {
  if (!sound.isPlaying()) return;
  translate(windowWidth / 2, windowHeight / 2);

  var spectrumA = fft.analyze();
  var spectrumB = spectrumA.reverse();
  spectrumB.splice(0, 40);

  rotate(radians(a));

  fft.analyze();
  peakDetect.update(fft);

  if (peakDetect.isDetected) {
    colorStep += 50;
    console.log("hee");
  }
  for (let i = 0; i < spectrumB.length; i++) {
    var amp = spectrumB[i];
    strokeWeight(0.025 * spectrumB[i]);
    stroke(
      0,
      (spectrumA[i] + colorStep + 10) % 255,
      // map((spectrumA[i] + colorStep + 10) % 255, 0, 255, 100, 200),
      map((colorStep + spectrumB[i]) % 255, 0, 255, 80, 255),
      spectrumB[i] / 2
    );
    let spectrumStep = map(i, 0, spectrumB.length, 20, 400);

    line(0, spectrumStep, 0, spectrumStep);
    line(0, -spectrumStep, 0, -spectrumStep);
  }

  a += b;
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
