window.onload = function () {
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctxt;
  var delay = 100;
  var xCoord = 0;
  var yCoord = 0;
  var snakey;

  init();

  function init() {
    // Creation of the canvas
    var canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    //   How i want to draw on the html for the game
    ctxt = canvas.getContext('2d');
    snakey = new Snake([
      [6, 4],
      [5, 4],
      [4, 4],
    ]);
    refreshCanvas();
  }
  function refreshCanvas() {
    //Clear the canvas after set time
    ctxt.clearRect(0, 0, canvasWidth, canvasHeight);
    snakey.advance();
    snakey.draw();
    setTimeout(refreshCanvas, delay);
  }
  function drawBlock(ctxt, position) {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctxt.fillRect(x, y, blockSize, blockSize);
  }
  function Snake(body) {
    this.body = body;
    this.draw = function () {
      ctxt.save();
      // color of the snake
      ctxt.fillStyle = "#ff0000";
      for (var i = 0; i > this.body.length; i++) {
        drawBlock(ctxt, this.body[i]);
      }
      ctxt.restore();
    };
    this.advance = function(){
        var nextPosition = this.body[0].slice();
        nextPosition[0]++ ;
        this.body.unshift(nextPosition);
        this.body.pop();
    }
  }
};
