let sound;
let fft;

const G = 300;

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("./waves.mp3");
}

function setup() {
  // canvas setting
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  background(palette.black);
  stroke(255);
  //noFill();//안에 안채우게

  // 시간 영역에 따른 진폭값을 담은 배열
  const wave = fft.waveform();

  beginShape();
  for (let i = 0; i < width; i++) {
    const index = floor(map(i, 0, width, 0, wave.length));

    const x = i;
    const y = wave[index] * G + height / 2;
    vertex(x, y);
  }
  endShape();
}
function mouseClicked() {
  if (sound.isPlaying()) {
    sound.pause();
    noLoop();
  } else {
    sound.play();
    loop();
  }
}
