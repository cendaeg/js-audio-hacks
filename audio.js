"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

function freq(note) {
  return Math.pow(2, (note.key - 49) / 12) * 440 / note.octave;
};

var Instrument = (function () {
  function Instrument(t) {
    _classCallCheck(this, Instrument);

    this.tau = 2 * Math.PI;
    this.t = t;
  }

  _prototypeProperties(Instrument, null, {
    sin: {
      value: function sin(x) {
        return Math.sin(this.tau * this.t * x);
      },
      writable: true,
      configurable: true
    },
    square: {
      value: function square(x) {
        return sin(x) > 0 ? 1 : -1;
      },
      writable: true,
      configurable: true
    },
    saw: {
      value: function saw(x) {
        return 1 - 2 * (this.t % (1 / x)) * x;
      },
      writable: true,
      configurable: true
    },
    drums: {
      value: function drums() {
        return this.t % (1 / 2) < 1 / 16 ? 2 * Math.random() - 1 : 0;
      },
      writable: true,
      configurable: true
    },
    bass: {
      value: function bass(x) {
        return this.t % 1 < 1 / 4 ? Math.sin(this.tau * this.t * x) : 0;
      },
      writable: true,
      configurable: true
    },
    lowDrums: {
      value: function lowDrums(x) {
        return this.t % (1 / 2) < 1 / 16 ? 10 * Math.cos(this.tau * this.t * x) : 0;
      },
      writable: true,
      configurable: true
    },
    pluck: {
      value: function pluck(freq, a, n, s) {
        var scalar = Math.max(0, 0.95 - this.t % a * n / (this.t % a * n + 1));
        var sum = 0;
        for (var i = 0; i < s; i++) {
          sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
        }
        return scalar * sum / 3;
      },
      writable: true,
      configurable: true
    },
    uku: {
      value: function uku(freq, a, n, s) {
        var scalar = Math.max(0, 0.95 - this.t % a * n / (this.t % a * n + 0.5));
        var sum = 0;
        for (var i = 0; i < s; i++) {
          sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
        }
        return scalar * sum / 3;
      },
      writable: true,
      configurable: true
    }
  });

  return Instrument;
})();

var Note = function Note(key, dur) {
  _classCallCheck(this, Note);

  var noteMap = { C: 4, D: 6, E: 8, F: 9, G: 11, A: 13, B: 15 };
  var octaveMap = {
    1: 1,
    2: 1 / 2,
    3: 1 / 4,
    4: 1 / 8,
    5: 1 / 16,
    6: 1 / 32,
    7: 1 / 64,
    8: 1 / 128
  };
  var note = {
    key: noteMap[key[0]],
    octave: octaveMap[key[1]]
  };
  this.freq = freq(note);
  this.duration = dur;
};

var ctx = new AudioContext();

var Waver = (function () {
  function Waver(ctx, dur, cb) {
    _classCallCheck(this, Waver);

    var channels = 2;
    var frameCount = ctx.sampleRate * dur;
    this.sourceBuffer = ctx.createBuffer(channels, frameCount, ctx.sampleRate);
    for (var channel = 0; channel < channels; channel++) {
      var nowBuffering = this.sourceBuffer.getChannelData(channel);
      for (var i = 0; i < this.sourceBuffer.length; i++) {
        nowBuffering[i] = cb(i / ctx.sampleRate);
      }
    }
  }

  _prototypeProperties(Waver, null, {
    update: {
      value: function update(ctx, dur, cb) {
        var channels = 2;
        var frameCount = ctx.sampleRate * dur;
        this.sourceBuffer = ctx.createBuffer(channels, frameCount, ctx.sampleRate);
        for (var channel = 0; channel < channels; channel++) {
          var nowBuffering = this.sourceBuffer.getChannelData(channel);
          for (var i = 0; i < this.sourceBuffer.length; i++) {
            nowBuffering[i] = cb(i / ctx.sampleRate);
          }
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Waver;
})();

var melody = [0, 1 / 2, 1 / 4, 1 / 2, 1 / 8, 1 / 4, 1 / 5, 1 / 16, 10 / 13, 0, 1 / 2, 1 / 4, 1 / 2, 1 / 8, 1 / 4, 1 / 5, 1 / 16, 10 / 13, 0, 1 / 2, 1 / 4, 1 / 2, 1 / 8, 1 / 4, 1 / 5, 1 / 16, 10 / 13].map(function (x) {
  return Math.pow(2, x);
});

var bassMelody = [0, 1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 8, 1 / 4, 1 / 2].map(function (x) {
  return Math.pow(2, x);
});

var node = new Waver(ctx, 8, function (t) {
  var i = new Instrument(t);
  var note = new Note("A4");
  var note2 = new Note("A5");
  var note3 = new Note("E5");

  var m = melody[Math.floor(t % melody.length)];
  var bm = bassMelody[Math.floor(t % melody.length)];
  return i.pluck(note.freq, 0.5, 10, 10) + i.bass(100);
});

var source = ctx.createBufferSource();
source.buffer = node.sourceBuffer;
source.connect(ctx.destination);
source.loop = true;

var b = document.querySelector(".start");
var on = false;

b.addEventListener("click", function () {
  if (!on) {
    source.start();
    on = true;
  } else {
    on = false;
    source.stop();
  }
});

setTimeout(function () {
  node.update(ctx, 8, function (t) {
    var i = new Instrument(t);
    var note = new Note("G4");
    var note2 = new Note("G5");
    var note3 = new Note("C5");
    var m = melody[Math.floor(t % melody.length)];
    var bm = bassMelody[Math.floor(t % melody.length)];
    return i.pluck(note.freq, 0.5, 10, 10) + i.bass(150);
  });
}, 3000);
