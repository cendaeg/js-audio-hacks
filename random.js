var lengthField = document.querySelector(".length");
var rateField = document.querySelector(".rate");
var adjustField = document.querySelector(".adjust");



ctx.onComplete = function( ev ){
  console.log(ev.renderedBuffer);
}


if(document.body.classList.contains("one")) {
  startOne();
  document.querySelector("button").addEventListener('click', function() {
    startOne();
  });
} else if (document.body.classList.contains("two")) {
  var socket = io.connect('http://leon.ngrok.com');
  var play;
  var i = 0;
  Leap.loop(function(frame) {
    frame.hands.forEach(function(hand, index) {
      var palm = hand.ringFinger.tipVelocity.map(function(a) { return Math.floor(a) })
      if(Math.abs(palm[0])>=100) {
        if(!play) {
          play = startTwo(ctx);
        }
        play[0].playbackRate.value = 2;
      } else {
        if(play) {
          play[0].playbackRate.value = 1;
        }
      }
    });
}).use('screenPosition', {scale: 0.25});
var back = document.querySelector(".background");
var other = document.querySelector(".other");
back.height = window.innerHeight;
back.width = window.innerWidth/2;
other.height = window.innerHeight;
other.width = window.innerWidth/2;
var bctx = back.getContext("2d");
var octx = other.getContext("2d");

var squareHeight = 50;
var _ = "transparent", b = "#8CCBFF", c = "#84D1FF", d = "#242633";
var image = [
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, c, c, c, c, c, c, c, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, b, b, b, b, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, d, b, b, d, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, d, b, b, d, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, b, b, b, b, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, d, b, b, b, b, d, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, d, d, d, d, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, b, b, b, b, b, b, c, _, _, _, _, _, _],
[_, _, _, _, _, _, c, c, c, c, c, c, c, c, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
[_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _]
];


socket.on('move head', function(msg){
  console.log(msg.x, msg.y);
  other.clearRect(0, 0, other.width, other.height);
  other.lineWidth = .25;
  for(var i=0;i<image.length;i++) {
    for(var j=0;j<image[0].length;j++) {
      octx.fillStyle = image[j][i];
      octx.fillRect(msg.x/5, msg.y/5, squareHeight/5, squareHeight/5);
    }
  }
});

var i =0;

document.addEventListener('headtrackingEvent', function(e) {
  i++;
  bctx.clearRect(0, 0, back.width, back.height);
  bctx.lineWidth = .25;
  for(var i=0;i<image.length;i++) {
    for(var j=0;j<image[0].length;j++) {
      bctx.fillStyle = image[j][i];
      bctx.fillRect(i*squareHeight+(10*e.x)-20, j*squareHeight+(-10*e.y), squareHeight, squareHeight);
      if(i%10===0) {
        socket.emit('head move', {x: i*squareHeight+(10*e.x), y: j*squareHeight+(-10*e.y)});
      }
    }
  }
})

Leap.loopController.setBackground(true);

var videoInput = document.getElementById('vid');
var canvasInput = document.getElementById('inputCanvas');

var htracker = new headtrackr.Tracker();
htracker.init(videoInput, canvasInput);
htracker.start();
} else if (document.body.classList.contains("three")) {

