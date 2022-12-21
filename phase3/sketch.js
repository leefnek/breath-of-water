var frames = [];
var frameCount = 0;
var voltage = 0;

function preload() {
  sound = loadSound("./phase3.m4a");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
  background(0);
}

function draw() {
  if (!sound.isPlaying()) return;
  var spectrum = fft.analyze();

  var frame = [];
  var lastFrame = frames[frames.length - 1] || {};
  var hasPeak = false;
  for (var i = 0; i < spectrum.length; i += 10) {
    var v = {
      spec: spectrum[i],
      value: spectrum[i],
      index: frameCount,
    };
    hasPeak = hasPeak || v.value > 140;
    frame.push(v);
  }

  frame.hasPeak = hasPeak && !lastFrame.hasPeak;
  frames.push(frame);
  if (frame.hasPeak) {
    voltage++;
  } else {
    voltage -= 0.86;
  }

  background(0, 0, voltage * 10, 100);
  frames.forEach(function (frame) {
    for (var i = 0; i < frame.length; i++) {
      var v = frame[i];
      var spent = frameCount - v.index;
      var v1 = (v.value / (spent * 2 + 1)) * (frame.hasPeak ? 2 : 1);
      var x = map(i, 0, frame.length, 0, width);
      var h = -height + map(v.value, 0, 255, height, -height / 10);
      strokeWeight(0.7);
      var alpha = Math.max(255 - (spent * spent + 1), 0);
      var col = color(
        Math.min(255, 100 + spent * spent * 10),
        Math.min(255, 140 + spent * spent * 10),
        map(Math.min(255, v.value + spent * spent * 10), 0, 255, 100, 500),
        alpha
      );
      stroke(col);
      noFill();

      if (frame.hasPeak && spent > 0) {
        noStroke();
        fill(col);
      }
      if (random(100) > 80) {
        ellipse(x + spent * spent * 3 + random(50), height + h, v1, v1);
      } else {
        var x = x + spent * spent * 2 + random(1000);
        var y = height + h;
        triangle(
          x,
          y,
          x - random(20),
          y - random(20),
          x + random(20),
          y + random(20)
        );
      }

      var step = 30;
      var x2 = Math.round((x + spent * spent * 3 + 60) / step) * step;
      var y2 = Math.round((height + h) / step) * step;
      var v2 = Math.round(v1 / step) * step;
      var col2 = color(
        Math.min(255, 10 + spent * spent),
        Math.min(255, 14 + spent * spent),
        map(spent * spent, 0, 255, 100, 500),
        alpha
      );

      stroke(col2);
      if (random(100) > 80) {
        rect(x2, y2, step * random(3), step * random(3));
      }
    }
  });
}

function keyPressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
