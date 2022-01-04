window.onload = function () {
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctxt;
  var delay = 100;
  var snakey;
  var appley;

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
      "right"
    ]);
    appley = new Apple([10, 10]);
    refreshCanvas();
  }

  function refreshCanvas() {
    //Clear the canvas after set time
    ctxt.clearRect(0, 0, canvasWidth, canvasHeight);
    snakey.advance();
    snakey.draw();
    appley.draw();
    setTimeout(refreshCanvas, delay);
  }

  function drawBlock(ctxt, position) {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctxt.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.draw = function () {
      ctxt.save();
      // color of the snake
      ctxt.fillStyle = "#ff0000";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctxt, this.body[i]);
      }
      ctxt.restore();
    };
    this.advance = function(){
        var nextPosition = this.body[0].slice();
        switch(this.direction){
            case "left":
                nextPosition[0] -= 1;
                break;
            case "right":
                nextPosition[0] += 1;
                break;
            case "down":
                nextPosition[1] += 1;
                break;
                case "up":
                nextPosition[1] -= 1;
                break;
            default :
                throw ("Invalid Direction");
        }
        this.body.unshift(nextPosition);
        this.body.pop();
    };
    this.setDirection = function(newDirection){
        var allowedDirections;
        switch(this.direction){
            case "left":
            case "right":
                allowedDirections = ["up", "down"];
                break;
            case "down":
            case "up":
            allowedDirections = ["left", "right"];
                break;
                default :
                throw ("Invalid Direction");
        }
        if(allowedDirections.indexOf(newDirection) > -1){
            this.direction = newDirection;
        }
    }
  }
  
  function Apple(position){
    this.position = position;
    this.draw = function(){
        ctxt.save();
        ctxt.fillStyle = "#33cc33";
        ctxt.beginPath();
        var radius = blockSize/2;
        var x = position[0]*blockSize + radius;
        var y = position[1]*blockSize + radius;
        ctxt.arc(x,y, raidus, 0, Math.PI*2, true);
        ctxt.fill();
        ctxt.restaure();
    };
  }

  document.onkeydown = function handleKeyDown(e){
      var key = e.keyCode;
      var newDirection;
      switch(key){
        case 37:
            newDirection = "left";
            break;
        case 38:
            newDirection = "up";
            break;
        case 39:
            newDirection = "right";
            break;
        case 40:
            newDirection = "down";
            break;
        default :
            return;
      }
      snakey.setDirection(newDirection);
  }
};
