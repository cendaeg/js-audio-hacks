var app = angular.module("beatMachine", []);

app.controller("app", ["$scope", function($scope) {
  $scope.beats = [
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  },
  {
    on: false,
    sound:"beat"
  }
  ];
  $scope.activate = function(beat) {
    beat.on = !beat.on;
  }
}]);

var squareHeight = 16;

var x = 0;

var canvas = document.querySelector("canvas")
var ctx = canvas.getContext("2d");
canvas.height = 16;
canvas.width = 16;
ctx.lineWidth = .25;
ctx.clearRect(0,0,canvas.height,canvas.width);

(function iconimate() {
  ctx.fillStyle = x%2==0 ? "#CE9900" : "#405D23";
  ctx.fillRect(canvas.height/2-squareHeight, canvas.height/2-squareHeight, squareHeight, squareHeight);
  //var icon=document.getElementById('favicon');
  //(newIcon = icon.cloneNode(true)).setAttribute('href',ctx.canvas.toDataURL());
  //icon.parentNode.replaceChild(newIcon,icon);
  window.requestAnimationFrame(iconimate());
  x++;
})();