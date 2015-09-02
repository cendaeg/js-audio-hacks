"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Instrument = (function () {
  function Instrument(t) {
    _classCallCheck(this, Instrument);

    this.tau = 2 * Math.PI;
    this.t = t;
  }

  _createClass(Instrument, [{
    key: "sin",
    value: function sin(x) {
      return Math.sin(this.tau * this.t * x);
    }
  }, {
    key: "square",
    value: function square(x) {
      return this.sin(x) > 0 ? 1 : -1;
    }
  }, {
    key: "saw",
    value: function saw(x) {
      return 1 - 2 * (this.t % (1 / x)) * x;
    }
  }, {
    key: "drums",
    value: function drums() {
      return this.t % (1 / 2) < 1 / 16 ? 2 * Math.random() - 1 : 0;
    }
  }, {
    key: "bass",
    value: function bass(x) {
      return this.t % 1 < 1 / 4 ? Math.sin(this.tau * this.t * x) : 0;
    }
  }, {
    key: "lowDrums",
    value: function lowDrums(x) {
      return this.t % (1 / 2) < 1 / 16 ? 10 * Math.cos(this.tau * this.t * x) : 0;
    }
  }, {
    key: "clarinet",
    value: function clarinet(x) {
      return this.sin(x) + 0.75 * this.sin(x * 3) + 0.5 * this.sin(x * 5) + 0.14 * this.sin(x * 7) + 0.5 * this.sin(x * 9) + 0.12 * this.sin(11 * x) + 0.17 * this.sin(x * 13);
    }
  }, {
    key: "chord",
    value: function chord(x) {
      return this.sin(x) + this.sin(x * (5 / 4)) + this.sin(x * (3 / 2));
    }
  }, {
    key: "violin",
    value: function violin(x) {
      return (this.sin(x) + 1 / 2 * this.sin(x * 2) + 1 / 3 * this.sin(x * 3) + 1 / 4 * this.sin(x * 4) + 1 / 5 * this.sin(x * 5) + 1 / 6 * this.sin(x * 6)) * this.sin(5) * (1 - Math.pow(Math.E, -this.t * 3));
    }
  }, {
    key: "pluck",
    value: function pluck(freq, a, n, s) {
      var scalar = Math.max(0, 0.95 - this.t % a * n / (this.t % a * n + 1));
      var sum = 0;
      for (var i = 0; i < s; i++) {
        sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
      }
      return scalar * sum / 3;
    }
  }, {
    key: "uku",
    value: function uku(freq, a, n, s) {
      var scalar = Math.max(0, 0.95 - this.t % a * n / (this.t % a * n + 0.5));
      var sum = 0;
      for (var i = 0; i < s; i++) {
        sum += Math.sin(this.tau * (this.t % a) * (freq + i * freq));
      }
      return scalar * sum / 3;
    }
  }]);

  return Instrument;
})();

function freq(note) {
  return Math.pow(2, (note.key - 49) / 12) * 440 / note.octave;
};

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

  _createClass(Waver, [{
    key: "init",
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
    }
  }]);

  return Waver;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function sum(terms) {
  return terms.reduce(function (a, b) {
    return a + b;
  });
}

var MusicMatrix = (function () {
  function MusicMatrix() {
    _classCallCheck(this, MusicMatrix);

    this._previous_note = null;
    this._markov = new MarkovBuilder(["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"]);
    this._timings = new MarkovBuilder([1, 2, 3, 4, 5, 6, 7, 8]);
  }

  _createClass(MusicMatrix, [{
    key: "add",
    value: function add(to_note) {
      if (this._previous_note === null) {
        this._previous_note = to_note;
        return true;
      }
      var from_note = this._previous_note;
      this._markov.add(from_note[0], to_note[0]);
      this._timings.add(from_note[1], to_note[1]);
      this._previous_note = to_note;
    }
  }, {
    key: "next_note",
    value: function next_note(from_note) {
      return [this._markov.next_value(from_note[0]), this._timings.next_value(from_note[1])];
    }
  }]);

  return MusicMatrix;
})();

var MarkovBuilder = (function () {
  function MarkovBuilder(value_list) {
    _classCallCheck(this, MarkovBuilder);

    this._values_added = 0;
    this._reverse_value_lookup = value_list;
    this._value_lookup = {};
    for (var i = 0; i < value_list.length; i++) {
      this._value_lookup[value_list[i]] = i;
    }
    this._matrix = [];
    for (var i = 0; i < value_list.length; i++) {
      this._matrix[i] = [];
      for (var j = 0; j < value_list.length; j++) {
        this._matrix[i][j] = 0;
      }
    }
  }

  _createClass(MarkovBuilder, [{
    key: "add",
    value: function add(from_value, to_value) {
      //Add a path from a note to another note. Re-adding a path between notes will increase the associated weight.
      var value = this._value_lookup;
      this._matrix[value[from_value]][value[to_value]] += 1;
      this._values_added = this._values_added + 1;
    }
  }, {
    key: "next_value",
    value: function next_value(from_value) {
      var value = this._value_lookup[from_value];
      var value_counts = this._matrix[value];
      var value_index = this.randomly_choose(value_counts);
      if (value_index < 0) {
        throw "Non-existent value selected.";
      } else {
        return this._reverse_value_lookup[value_index];
      }
    }
  }, {
    key: "randomly_choose",
    value: function randomly_choose(choice_counts) {
      //Given an array of counts, returns the index that was randomly chosen
      var counted_sum = 0;
      var count_sum = sum(choice_counts);
      var selected_count = Math.floor(Math.random() * (count_sum - 1) + 1);
      for (var i = 0; i < choice_counts.length; i++) {
        counted_sum += choice_counts[i];
        if (counted_sum >= selected_count) {
          return i;
        }
      }
      throw "Impossible value selection made. BAD!";
    }
  }]);

  return MarkovBuilder;
})();

var musicLearner = new MusicMatrix();

musicLearner.add(["d", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["e", 3]);
musicLearner.add(["d", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["f", 4]);

musicLearner.add(["c", 4]);
musicLearner.add(["c", 4]);
musicLearner.add(["c", 4]);

musicLearner.add(["g", 4]);
musicLearner.add(["g", 4]);
musicLearner.add(["g", 4]);

musicLearner.add(["e", 2]);
musicLearner.add(["e", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["e", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["e", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["e", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["e", 4]);

musicLearner.add(["c", 4]);
musicLearner.add(["c", 4]);
musicLearner.add(["c", 4]);

musicLearner.add(["g", 3]);
musicLearner.add(["f", 4]);
musicLearner.add(["e", 3]);
musicLearner.add(["d", 4]);
"use strict";

var ctx = new (window.AudioContext || window.webkitAudioContext)();
var instruments = [];
function instrumentUpdate(ins) {
  instruments.push(ins);
  if (play) {
    stopTwo(play[0]);
    play = startTwo(ctx, instruments);
  }
}
function instrumentRemove(ins) {
  instruments = instruments.splice(instruments.indexOf(ins), 1);
  if (play) {
    stopTwo(play[0]);
    play = startTwo(ctx, instruments);
  }
}
var play;
var inputElements = document.getElementsByClassName("instrument");
for (var i = 0; i < inputElements.length; i++) {
  if (inputElements[i].checked) {
    instrumentUpdate(inputElements[i].value);
  }
  inputElements[i].onclick = function () {
    if (this.checked) {
      instrumentUpdate(this.value);
    } else {
      instrumentRemove(this.value);
    }
  };
}
play = startTwo(ctx, instruments);

function startTwo(ctx, instruments) {
  var random_score = [];
  current_note = ["c", 4];
  for (var i = 0; i < 50; i++) {
    var current_note = musicLearner.next_note(current_note);
    var note = new Note(current_note[0].toUpperCase() + current_note[1].toString());
    random_score.push(note);
  }
  var node = new Waver(ctx, 32, function (t) {
    var i = new Instrument(t);
    var sum = 0;
    for (var j = 0; j < instruments.length; j++) {
      switch (instruments[j]) {
        case "chord":
          sum += i.chord(random_score[Math.floor(t % random_score.length)].freq);
          break;
        case "clarinet":
          sum += i.clarinet(random_score[Math.floor(t % random_score.length)].freq);
          break;
        case "violin":
          sum += i.violin(random_score[Math.floor(t % random_score.length)].freq * 2);
          break;
        case "pluck":
          sum += i.pluck(random_score[Math.floor(t % random_score.length)].freq * 3 / 2, 0.5, 10, 10);
          break;
        case "drum":
          sum += i.drums() + (i.sin(3) + i.sin(4));
          break;
        case "bass":
          sum += i.bass(random_score[Math.floor(t % random_score.length)].freq % 200);
          break;
        case "lowDrum":
          sum += i.lowDrums(100) + (i.sin(2) + i.square(3));
          break;
      }
    }
    return sum;
  });
  var song = ctx.createBufferSource();
  var synthDelay = ctx.createDelay(5);
  song.loop = true;
  song.buffer = node.sourceBuffer;
  song.start();
  song.connect(ctx.destination);
  return [song, node];
};

function stopTwo(song) {
  song.stop();
  song.disconnect();
}
