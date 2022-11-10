let sound;
let fft;

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("./waves.mp3");
}

function setup() {
  // canvas setting
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  fft = new p5.FFT();
}

function draw() {
  background(palette.black);
  stroke(255);

  translate(width / 2, height / 2);

  // 시간 영역에 따른 진폭값을 담은 배열
  const wave = fft.waveform();

  for (let times of [-1, 1]) {
    beginShape();
    for (let degree = 0; degree <= 180; degree++) {
      const index = floor(map(degree, 0, width, 0, wave.length - 1));
      //min and maximum radius of the circle
      const r = map(wave[index], -1, 1, 150, 350);
      const x = r * sin(degree) * times;
      const y = r * cos(degree);
      vertex(x, y);
    }
    endShape();
  }
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
