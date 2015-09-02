var ctx = new (window.AudioContext || window.webkitAudioContext)();
var instruments = [];
function instrumentUpdate(ins) {
  instruments.push(ins);
  if(play) {
    stopTwo(play[0])
    play = startTwo(ctx, instruments);
  }
}
function instrumentRemove(ins) {
  instruments = instruments.splice(instruments.indexOf(ins), 1);
  if(play) {
    stopTwo(play[0])
    play = startTwo(ctx, instruments);
  }
}
var play;
var inputElements = document.getElementsByClassName('instrument');
for(var i = 0; i < inputElements.length; i++){
  if(inputElements[i].checked) {
    instrumentUpdate(inputElements[i].value);
  }
  inputElements[i].onclick = function() {
    if(this.checked) {
      instrumentUpdate(this.value);
    } else {
      instrumentRemove(this.value);
    }
  };
}
play = startTwo(ctx, instruments);

function startTwo(ctx, instruments) {
  var random_score = []
  current_note = ["c", 4]
  for(var i = 0;i < 50; i++) {
    var current_note = musicLearner.next_note(current_note);
    var note = new Note(current_note[0].toUpperCase()+current_note[1].toString());
    random_score.push(note);
  }
  var node = new Waver(ctx, 32.0, function(t) {
    var i = new Instrument(t);
    var sum = 0;
    for(var j = 0; j < instruments.length; j++) {
      switch(instruments[j]) {
        case "chord":
        sum += i.chord(random_score[Math.floor(t%random_score.length)].freq)
        break;
        case "clarinet":
        sum += i.clarinet(random_score[Math.floor(t%random_score.length)].freq)
        break;
        case "violin":
        sum += i.violin(random_score[Math.floor(t%random_score.length)].freq*2)
        break;
        case "pluck":
        sum += i.pluck(random_score[Math.floor(t%random_score.length)].freq*3/2, 0.5, 10, 10);
        break;
        case "drum":
        sum += i.drums() + (i.sin(3) + i.sin(4));
        break;
        case "bass":
        sum += i.bass(random_score[Math.floor(t%random_score.length)].freq%200);
        break;
        case "lowDrum":
        sum += i.lowDrums(100) + (i.sin(2) + i.square(3));
        break;
      }
    }
    return sum;
  });
  var song = ctx.createBufferSource();
  var synthDelay = ctx.createDelay(5.0);
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
