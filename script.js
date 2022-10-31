window.onload = function () {
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctxt;
  var delay = 100;
  var snakey;
  var appley;
  var widthInBlocks = canvasWidth / blockSize;
  var heightInBlocks = canvasHeight / blockSize;
  var square_available = 597;
  var score;
  var timeout;
  var confettiTimeOut;

  //Call the function to start everything
  init();

  function init() {
    console.log("init");
    // Creation of the canvas
    var canvas = document.createElement("canvas");
    var container = document.getElementById("container")
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "15px solid #333333";
    canvas.style.margin = "20px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#e5e5e5";
    container.appendChild(canvas);
    //   How i want to draw on the html for the game
    ctxt = canvas.getContext("2d");
    // original position of the snake
    snakey = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    appley = new Apple([10, 10]);
    score = 0;
    refreshCanvas();

  }

  //function to restart the game properly
  function refreshCanvas() {
    snakey.advance();
    if (snakey.checkCollision()) {
      gameOver();
    } else {
      if (snakey.isEatingApple(appley)) {
        score++;
        snakey.ateApple = true;
        do {
          appley.setNewPosition();
        } while (appley.isOnSnake(snakey));
      }
      //Clear the canvas after set time
      ctxt.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      snakey.draw();

      if (score === square_available) {
        return EndGame();
      }
      
      appley.draw();
      timeout = setTimeout(refreshCanvas, delay);
      clearTimeout(confettiTimeOut);
    }
  }

  //Text that says you lost
  function gameOver() {
    ctxt.save();
    ctxt.font = "bold 70px sans-serif";
    ctxt.fillStyle = "black";
    ctxt.textAlign = "center";
    ctxt.textBaseline = "middle";
    ctxt.strokeStyle = "white";
    ctxt.lineWidth = 5;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    ctxt.strokeText("Game Over", centreX, centreY - 180);
    ctxt.fillText("Game Over", centreX, centreY - 180);
    ctxt.font = "bold 40px sans-serif";
    ctxt.strokeText("Press enter to play again", centreX, centreY - 120);
    ctxt.fillText("Press enter to play again", centreX, centreY - 120);
    ctxt.restore();
  }

  function restart() {
    snakey = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    appley = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    clearTimeout(confettiTimeOut);
    refreshCanvas();
  }

  // Score on screen
  function drawScore() {
    console.log("drawScore");
    ctxt.save();
    ctxt.font = "bold 200px sans-serif";
    ctxt.fillStyle = "gray";
    ctxt.textAlign = "center";
    ctxt.textBaseline = "middle";
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    // ctxt.fillText("Score:", 0, 600);
    ctxt.fillText(score.toString(), centreX, centreY);
    ctxt.restore();
  }

  // Canvas' division into blocks
  function drawBlock(ctxt, position) {
    console.log("drawBlock");
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctxt.fillRect(x, y, blockSize, blockSize);
  }

  // Snake creation
  function Snake(body, direction) {
    console.log("Snake");
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
      ctxt.save();
      // color of the snake
      ctxt.fillStyle = "#007f3f";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctxt, this.body[i]);
      }
      ctxt.restore();
    };
    this.advance = function () {
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
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
        default:
          throw "Invalid Direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    };
    this.setDirection = function (newDirection) {
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "Invalid Direction";
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };
    //checking if Snake crash against something
    this.checkCollision = function () {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var tail = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        wallCollision = true;
      }

      for (var i = 0; i < tail.length; i++) {
        if (snakeX === tail[i][0] && snakeY === tail[i][1]) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function (appleToEat) {
      var head = this.body[0];
      if (
        head[0] === appleToEat.position[0] &&
        head[1] === appleToEat.position[1]
      ) {
        return true;
      } else return false;
    };
  }

  //When you finish the game
  function EndGame() {
    ctxt.save();
    ctxt.font = "bold 70px sans-serif";
    ctxt.fillStyle = "black";
    ctxt.textAlign = "center";
    ctxt.textBaseline = "middle";
    ctxt.strokeStyle = "white";
    ctxt.lineWidth = 5;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    ctxt.strokeText("Game Done !", centreX, centreY - 180);
    ctxt.fillText("Game Done !", centreX, centreY - 180);
    ctxt.font = "bold 40px sans-serif";
    ctxt.strokeText("Press enter to play again", centreX, centreY - 120);
    ctxt.fillText("Press enter to play again", centreX, centreY - 120);
    ctxt.restore();

    //Call of the confettis
    const DURATION = 6000,
      LENGTH = 120;

    new Confetti({
      width: window.innerWidth,
      height: window.innerHeight,
      length: LENGTH,
      duration: DURATION,
    });
  }

  //Random Apple 
  function Apple(position) {
    this.position = position;
    this.draw = function () {
      ctxt.save();
      ctxt.fillStyle = "#bf0000";
      ctxt.beginPath();
      var radius = blockSize / 2;
      var x = this.position[0] * blockSize + radius;
      var y = this.position[1] * blockSize + radius;
      ctxt.arc(x, y, radius, 0, Math.PI * 2, true);
      ctxt.fill();
      ctxt.restore();
    };
    this.setNewPosition = function () {
      var newX = Math.round(Math.random() * (widthInBlocks - 1));
      var newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function (snakeToCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] === snakeToCheck.body[i][0] &&
          this.position[1] === snakeToCheck.body[i][1]
        ) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }


  // Key code for directions and actions
  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
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
      case 13:
        restart();
        return;
      default:
        return;
    }
    snakey.setDirection(newDirection);
  };
};
