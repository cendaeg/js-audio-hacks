"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

//Code borrowed from RecorderJS

var Export = (function () {
  function Export(audioBuffer) {
    _classCallCheck(this, Export);

    console.log(audioBuffer);
    this.audioBuffer = audioBuffer;
    this.sampleRate = audioBuffer.sampleRate;
    this.numChannels = audioBuffer.numberOfChannels;
    this.recBuffers = [];
    this.recLength = audioBuffer.length;
    this.recBuffers.push(this.audioBuffer.getChannelData(0));
  }

  _prototypeProperties(Export, null, {
    "export": {
      value: function _export() {
        var buffers = [];
        for (var channel = 0; channel < this.numChannels; channel++) {
          buffers.push(this.mergeBuffers(this.recBuffers, this.recLength));
        }
        if (this.numChannels === 2) {
          var interleaved = this.interleave(buffers[0], buffers[1]);
        } else {
          var interleaved = buffers[0];
        }
        var dataview = this.encodeWAV(interleaved);
        var audioBlob = new Blob([dataview], { type: "audio/wav" });
        return audioBlob;
      },
      writable: true,
      configurable: true
    },
    interleave: {
      value: function interleave(inputL, inputR) {
        var length = inputL.length + inputR.length;
        var result = new Float32Array(length);

        var index = 0,
            inputIndex = 0;

        while (index < length) {
          result[index++] = inputL[inputIndex];
          result[index++] = inputR[inputIndex];
          inputIndex++;
        }
        return result;
      },
      writable: true,
      configurable: true
    },
    mergeBuffers: {
      value: function mergeBuffers(recBuffers, recLength) {
        console.log(recBuffers);
        var result = new Float32Array(recLength);
        var offset = 0;
        for (var i = 0; i < recBuffers.length; i++) {
          result.set(recBuffers[i], offset);
          offset += recBuffers[i].length;
        }
        return result;
      },
      writable: true,
      configurable: true
    },
    writeString: {
      value: function writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      },
      writable: true,
      configurable: true
    },
    encodeWAV: {
      value: function encodeWAV(samples) {
        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);

        /* RIFF identifier */
        this.writeString(view, 0, "RIFF");
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * 2, true);
        /* RIFF type */
        this.writeString(view, 8, "WAVE");
        /* format chunk identifier */
        this.writeString(view, 12, "fmt ");
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, this.numChannels, true);
        /* sample rate */
        view.setUint32(24, this.sampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, this.sampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, this.numChannels * 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        this.writeString(view, 36, "data");
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        this.floatTo16BitPCM(view, 44, samples);

        return view;
      },
      writable: true,
      configurable: true
    },
    floatTo16BitPCM: {
      value: function floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
          var s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Export;
})();
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Instrument = (function () {
  function Instrument(t) {
    _classCallCheck(this, Instrument);

    this.tau = 2 * Math.PI;
    this.t = t;
  }

  _prototypeProperties(Instrument, null, {
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
    clarinet: {
      value: function clarinet(x) {
        return this.sin(x) + 0.75 * this.sin(x * 3) + 0.5 * this.sin(x * 5) + 0.14 * this.sin(x * 7) + 0.5 * this.sin(x * 9) + 0.12 * this.sin(11 * x) + 0.17 * this.sin(x * 13);
      },
      writable: true,
      configurable: true
    },
    chord: {
      value: function chord(x) {
        return this.sin(x) + this.sin(x * (5 / 4)) + this.sin(x * (3 / 2));
      },
      writable: true,
      configurable: true
    },
    violin: {
      value: function violin(x) {
        return (this.sin(x) + 1 / 2 * this.sin(x * 2) + 1 / 3 * this.sin(x * 3) + 1 / 4 * this.sin(x * 4) + 1 / 5 * this.sin(x * 5) + 1 / 6 * this.sin(x * 6)) * this.sin(5) * (1 - Math.pow(Math.E, -this.t * 3));
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

var Waver = (function () {
  function Waver(ctx, dur, cb) {
    _classCallCheck(this, Waver);

    this.frequencyAdjust = 2;
    this.ctx = ctx;
    this.dur = dur;
    this.cb = cb;
    this.init();
  }

  _prototypeProperties(Waver, null, {
    init: {
      value: function init() {
        var channels = 2;
        var frameCount = this.ctx.sampleRate * this.dur;
        this.sourceBuffer = this.ctx.createBuffer(channels, frameCount, this.ctx.sampleRate);
        for (var channel = 0; channel < channels; channel++) {
          var nowBuffering = this.sourceBuffer.getChannelData(channel);
          for (var i = 0; i < this.sourceBuffer.length; i++) {
            nowBuffering[i] = this.cb(i / ctx.sampleRate);
          }
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Waver;
})();
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Instruments = (function () {
  function Instruments(t) {
    _classCallCheck(this, Instruments);

    this.tau = 2 * Math.PI;
    this.t = t;
  }

  _prototypeProperties(Instruments, null, {
    sin: {
      value: function sin(x) {
        return Math.sin(this.tau * this.t * x);
      },
      writable: true,
      configurable: true
    },
    square: {
      value: function square(x) {
        return this.sin(x) > 0 ? 1 : -1;
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
    }
  });

  return Instruments;
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

var beatMachine = (function () {
  function beatMachine(ctx, dur, cb) {
    _classCallCheck(this, beatMachine);

    this.frequencyAdjust = 2;
    this.ctx = ctx;
    this.dur = dur;
    this.cb = cb;
    this.init();
  }

  _prototypeProperties(beatMachine, null, {
    noteToFreq: {
      value: function noteToFreq() {
        return Math.pow(2, (note.key - 49) / 12) * 440 / note.octave;
      },
      writable: true,
      configurable: true
    },
    init: {
      value: function init() {
        var channels = 2;
        var frameCount = this.ctx.sampleRate * this.dur;
        this.sourceBuffer = this.ctx.createBuffer(channels, frameCount, this.ctx.sampleRate);
        for (var channel = 0; channel < channels; channel++) {
          var nowBuffering = this.sourceBuffer.getChannelData(channel);
          for (var i = 0; i < this.sourceBuffer.length; i++) {
            nowBuffering[i] = this.cb(i / ctx.sampleRate);
          }
        }
      },
      writable: true,
      configurable: true
    }
  });

  return beatMachine;
})();
