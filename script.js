window.onload = function () {
    var canvas;
    var ctxt;
    var delay = 100;
    var xCoord = 0;
    var yCoord = 0;

    init();

  function init() {
    // Creation of the canvas
    var canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    //   How i want to draw on the html for the game
    ctxt = canvas.getContext("2d");
    refreshCanvas();
    
  }
  function refreshCanvas(){
      xCoord += 2;
      yCoord += 2;
    // color of the snake
    ctxt.fillStyle = "#ff0000";
    //Clear the canvas after set time
    ctxt.clearRect(0,0 canvas.width, canvas.height);
    //   30 px from Y and from X axes + size of the "snake"
    ctxt.fillRect(xCoord, yCoord, 100, 50);
    setTimeout(refreshCanvas, delay);
  }
};
