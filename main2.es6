var lengthField = document.querySelector(".length");
var rateField = document.querySelector(".rate");
var adjustField = document.querySelector(".adjust");

var offlineCtx;
var ctx = new (window.AudioContext || window.webkitAudioContext)();

startOne();
document.querySelector("button").addEventListener('click', function() {
  startOne();
});

function startOne() {
  var random_score = []
  current_note = ["c", 4]
  for(var i = 0;i < 50; i++) {
    var current_note = musicLearner.next_note(current_note);
    var note = new Note(current_note[0].toUpperCase()+current_note[1].toString());
    random_score.push(note);
  }
  var numChannels = 2, lengthInSamples = parseInt(lengthField.value, 10), sampleRate = 44100;
  lengthInSamples = parseInt(lengthField.value, 10) || 15;
  offlineCtx = new OfflineAudioContext(numChannels, sampleRate*lengthInSamples, sampleRate);
  var node = new Waver(offlineCtx, 32.0, function(t) {
    var i = new Instrument(t);
    var note = random_score[Math.floor((t) % random_score.length)];
    return (0
      + i.chord(note.freq)
      + i.bass((note.freq*(3/2))/2)
      + i.lowDrums(100)
      )/3;
  });
  var source = offlineCtx.createBufferSource();
  source.loop = true;
  source.playbackRate.value = parseInt(rateField.value, 10) || 3;
  source.buffer = node.sourceBuffer;
  source.connect(offlineCtx.destination);
  source.start();
  offlineCtx.startRendering()
  offlineCtx.oncomplete = function(e) {
    console.log('Rendering completed successfully');
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var song = audioCtx.createBufferSource();
    song.connect(audioCtx.destination);
    song.buffer = e.renderedBuffer;
    var ex = new Export(e.renderedBuffer);
    var songBlob = ex.export();
    var a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(songBlob);
    a.href = url;
    a.download = "song.wav";
    a.textContent = "Download";
    var audio = document.querySelector("audio");
    audio.src = url;
//song.start();
}
};