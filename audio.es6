class Instrument {
  constructor(t) {
    this.tau = 2 * Math.PI;
    this.t = t;
  }
  sin(x) {
    return Math.sin(this.tau * this.t * x);
  }
  square(x) {
    return this.sin(x) > 0 ? 1 : -1;
  }
  saw(x) {
    return 1 - 2 * (this.t % (1 / x)) * x;
  }
  drums() { return this.t % (1/2) < 1/16 ? 2*Math.random()-1 : 0 };
  bass(x) { return this.t % (1) < 1/4 ? Math.sin((this.tau * this.t * x)) : 0 };
  lowDrums(x) { return this.t % (1/2) < 1/16 ? 10*Math.cos((this.tau * this.t * x)) : 0 };
  clarinet(x) { return this.sin(x)+0.75*this.sin(x*3)+0.5*this.sin(x*5)+0.14*this.sin(x*7)+0.5*this.sin(x*9)+0.12*this.sin(11*x)+0.17*this.sin(x*13); }
  chord(x) {
    return this.sin(x)+this.sin(x*(5/4))+this.sin(x*(3/2));
  }
  violin(x) { return (this.sin(x)+1/2 * this.sin(x*2) + 1/3*this.sin(x*3) + 1/4*this.sin(x*4) + 1/5*this.sin(x*5) + 1/6*this.sin(x*6))*this.sin(5)*(1-Math.pow(Math.E, -this.t*3)); }
  pluck(freq, a, n, s) {
    var scalar = Math.max(0, 0.95 - ((this.t % a) * n) / (((this.t % a) * n) + 1));
    var sum = 0;
    for (var i = 0; i < s; i++) {
      sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
    }
    return scalar * sum / 3;
  };
  uku(freq, a, n, s) {
    var scalar = Math.max(0, 0.95 - ((this.t % a) * n) / (((this.t % a) * n) + 0.5));
    var sum = 0;
    for (var i = 0; i < s; i++) {
      sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
    }
    return scalar * sum / 3;
  };
}

function freq(note) {
  return Math.pow(2, (note.key - 49) / 12) * 440 / note.octave;
};


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

/*class Buffer {
constructor(ctx) {
this.ctx = ctx;
this.bufferList = [];
this.bufferSources = [];
}
createAllBufferSources() {
for (var i = 0; i < this.bufferList.length; i++) {
this.ctx.decodeAudioData(this.bufferList[i], function(buffer)
{
var source = createBufferSource();
bufferData = buffer;
source.buffer = bufferData;
source.loop = true;
this.bufferSources.push(source);
}, this.onDecodeError);
}
}
createBuffer(cb, dur) {
var arrayBuffer = new Float32Array(44100*dur);
for(var i = 0; i < 44100*dur; i++) {
arrayBuffer[i] = cb(this.frequencyAdjust, i/44100);
}
this.bufferList.push(arrayBuffer);
}
getBuffers() {
return this.bufferList;
}
updateBuffer(cb, dur) {
var arrayBuffer = [];
for(var i = 0; i < 44100*dur; i++) {
arrayBuffer[i] = cb(this.frequencyAdjust, i/44100);
}
this.bufferList.push(arrayBuffer);
}
}*/


class Waver {
  constructor(ctx, dur, cb) {
    this.frequencyAdjust = 2;
    this.ctx = ctx;
    this.dur = dur;
    this.cb = cb;
    this.init();
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
