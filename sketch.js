let sound;

function preload() {
  soundFormats("mp3", "ogg");
  sound = loadSound("./waves.mp3");
}

function setup() {
  getAudioContext().suspend();
  sound.play();
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  text(getAudioContext().state, width / 2, height / 2);
}
function mousePressed() {
  userStartAudio();
}
