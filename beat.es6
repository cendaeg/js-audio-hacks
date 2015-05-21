class Instruments {
  constructor(t) {
    this.tau = 2 * Math.PI;
    this.t = t;
  }
  sin(x) { return Math.sin(this.tau * this.t * x); }
  square(x) { return this.sin(x) > 0 ? 1 : -1; }
  saw(x) { return 1 - 2 * (this.t % (1/x)) * x; }
  drums() { return this.t % (1/2) < 1/16 ? 2*Math.random()-1 : 0; };
}

class Note {
  constructor(key, dur) {
    var noteMap = {C:4, D:6, E:8, F:9, G:11, A:13, B:15};
    var octaveMap = {
      1: 1,
      2: 1/2,
      3: 1/4,
      4: 1/8,
      5: 1/16,
      6: 1/32,
      7: 1/64,
      8: 1/128
    }
    var note = {
      key: noteMap[key[0]],
      octave: octaveMap[key[1]]
    };
    this.freq = freq(note);
    this.duration = dur;
  }
}

class beatMachine {
  constructor(ctx, dur, cb) {
    this.frequencyAdjust = 2;
    this.ctx = ctx;
    this.dur = dur;
    this.cb = cb;
    this.init();
  }
  noteToFreq() {
    return (Math.pow(2, (note.key-49)/12)*440)/note.octave;
  }
  init() {
    var channels = 2;
    var frameCount = this.ctx.sampleRate * this.dur;
    this.sourceBuffer = this.ctx.createBuffer(channels, frameCount, this.ctx.sampleRate);
    for (var channel = 0; channel < channels; channel++) {
      var nowBuffering = this.sourceBuffer.getChannelData(channel);
      for (var i = 0; i < this.sourceBuffer.length; i++) {
        nowBuffering[i] = this.cb(i/ctx.sampleRate);
      }
    }
  }
}