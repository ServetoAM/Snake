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
  var square_available =
    (canvasWidth * canvasHeight) / (blockSize * blockSize) - 3;
  var score;
  var timeout;

  init();

  function init() {
    // Creation of the canvas
    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "15px solid #333333";
    canvas.style.margin = "20px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#e5e5e5";
    document.body.appendChild(canvas);
    //   How i want to draw on the html for the game
    ctxt = canvas.getContext("2d");
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
      appley.draw();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

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
    refreshCanvas();
  }

  function drawScore() {
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

  function drawBlock(ctxt, position) {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    ctxt.fillRect(x, y, blockSize, blockSize);
  }

  function Snake(body, direction) {
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
        if (score === square_available) {
          return EndGame();
        }
        return true;
      } else return false;
    };
  }

  function EndGame() {
    class Progress {
      constructor(param = {}) {
        this.timestamp = null;
        this.duration = param.duration || Progress.CONST.DURATION;
        this.progress = 0;
        this.delta = 0;
        this.progress = 0;
        this.isLoop = !!param.isLoop;

        this.reset();
      }

      static get CONST() {
        return {
          DURATION: 1000,
        };
      }

      reset() {
        this.timestamp = null;
      }

      start(now) {
        this.timestamp = now;
      }

      tick(now) {
        if (this.timestamp) {
          this.delta = now - this.timestamp;
          this.progress = Math.min(this.delta / this.duration, 1);

          if (this.progress >= 1 && this.isLoop) {
            this.start(now);
          }

          return this.progress;
        } else {
          return 0;
        }
      }
    }

    class Confetti {
      constructor(param) {
        this.parent = param.elm || document.body;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = param.width || this.parent.offsetWidth;
        this.height = param.height || this.parent.offsetHeight;
        this.length = param.length || Confetti.CONST.PAPER_LENGTH;
        this.yRange = param.yRange || this.height * 2;
        this.progress = new Progress({
          duration: param.duration,
          isLoop: true,
        });
        this.rotationRange =
          typeof param.rotationLength === "number" ? param.rotationRange : 10;
        this.speedRange =
          typeof param.speedRange === "number" ? param.speedRange : 10;
        this.sprites = [];

        this.canvas.style.cssText = [
          "display: block",
          "position: absolute",
          "top: 0",
          "left: 0",
          "pointer-events: none",
        ].join(";");

        this.render = this.render.bind(this);

        this.build();

        this.parent.appendChild(this.canvas);
        this.progress.start(performance.now());

        requestAnimationFrame(this.render);
      }

      static get CONST() {
        return {
          SPRITE_WIDTH: 9,
          SPRITE_HEIGHT: 16,
          PAPER_LENGTH: 100,
          DURATION: 8000,
          ROTATION_RATE: 50,
          COLORS: [
            "#EF5350",
            "#EC407A",
            "#AB47BC",
            "#7E57C2",
            "#5C6BC0",
            "#42A5F5",
            "#29B6F6",
            "#26C6DA",
            "#26A69A",
            "#66BB6A",
            "#9CCC65",
            "#D4E157",
            "#FFEE58",
            "#FFCA28",
            "#FFA726",
            "#FF7043",
            "#8D6E63",
            "#BDBDBD",
            "#78909C",
          ],
        };
      }

      build() {
        for (let i = 0; i < this.length; ++i) {
          let canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

          canvas.width = Confetti.CONST.SPRITE_WIDTH;
          canvas.height = Confetti.CONST.SPRITE_HEIGHT;

          canvas.position = {
            initX: Math.random() * this.width,
            initY: -canvas.height - Math.random() * this.yRange,
          };

          canvas.rotation =
            this.rotationRange / 2 - Math.random() * this.rotationRange;
          canvas.speed =
            this.speedRange / 2 + Math.random() * (this.speedRange / 2);

          ctx.save();

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

          ctx.fillStyle =
            Confetti.CONST.COLORS[
              (Math.random() * Confetti.CONST.COLORS.length) | 0
            ];
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          this.sprites.push(canvas);
        }
      }

      render(now) {
        let progress = this.progress.tick(now);

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        for (let i = 0; i < this.length; ++i) {
          this.ctx.save();
          this.ctx.translate(
            this.sprites[i].position.initX +
              this.sprites[i].rotation *
                Confetti.CONST.ROTATION_RATE *
                progress,
            this.sprites[i].position.initY +
              progress * (this.height + this.yRange)
          );
          this.ctx.rotate(this.sprites[i].rotation);
          this.ctx.drawImage(
            this.sprites[i],
            (-Confetti.CONST.SPRITE_WIDTH *
              Math.abs(
                Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)
              )) /
              2,
            -Confetti.CONST.SPRITE_HEIGHT / 2,
            Confetti.CONST.SPRITE_WIDTH *
              Math.abs(
                Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)
              ),
            Confetti.CONST.SPRITE_HEIGHT
          );
          this.ctx.restore();
        }

        requestAnimationFrame(this.render);
      }
    }

    (() => {
      const DURATION = 8000,
        LENGTH = 120;

      new Confetti({
        width: window.innerWidth,
        height: window.innerHeight,
        length: LENGTH,
        duration: DURATION,
      });

      setTimeout(() => {
        new Confetti({
          width: window.innerWidth,
          height: window.innerHeight,
          length: LENGTH,
          duration: DURATION,
        });
      }, DURATION / 2);
    })();
  }

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
