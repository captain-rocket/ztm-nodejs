//* Canvas Related
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let paddleIndex = 0;
const socket = io('/pong');
let isReferee = false;
let gameReady = true;
let playerStatus = true;

let width = 500;
let height = 700;

//* Paddle
let paddleHeight = 10;
let paddleWidth = 50;
let paddleDiff = 25;
let paddleX = [225, 225];
let trajectoryX = [0, 0];
let playerMoved = false;

//* Ball
let ballX = 250;
let ballY = 350;
let ballRadius = 5;
let ballDirection = 1;

//* Speed
let speedY = 2;
let speedX = 0;
// let computerSpeed = 4;

//* Score for Both Players
let score = [0, 0];

//* Create Canvas Element
function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  renderCanvas();
}

//* Wait for Opponents
function renderIntro() {
  //* Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  //* Intro Text
  context.fillStyle = 'white';
  context.font = '32px Helvetica';
  context.fillText('Waiting for opponent...', 20, canvas.height / 2 - 30);
}
// * Countdown before the game starts
function preGameCountdown(callback) {
  let countdown = 3;

  const countdownInterval = setInterval(() => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'white';
    context.font = '50px Helvetica';
    context.fillText(countdown, width / 2 - 15, height / 2);
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      callback();
    }
  }, 1000);
}
function renderEnd() {
  console.log('renderEnd Started');
  console.log('playerStatus renderEnd', playerStatus);
  //* Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  //* Intro Text
  context.fillStyle = 'Green';
  context.font = '32px Helvetica';
  context.fillText(`Player GREENS`, 20, canvas.height / 2 - 300);
  context.fillText(`Score is ${score[1]}`, 20, canvas.height / 2 - 250);
  context.fillStyle = 'red';
  context.fillText(`GAME OVER`, canvas.width / 2 - 200, canvas.height / 2);
  context.fillText('😟', canvas.width / 2, canvas.height / 2 + 100);
  context.fillStyle = 'blue';
  context.fillText(`Player BLUE'S`, 20, canvas.height / 2 + 250);
  context.fillText(`score is ${score[0]}`, 20, canvas.height / 2 + 300);
}

//* Render Everything on Canvas
function renderCanvas() {
  //* Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  //* Bottom Paddle
  context.fillStyle = 'blue';
  context.fillRect(paddleX[0], height - 20, paddleWidth, paddleHeight);

  //* Top Paddle
  context.fillStyle = 'green';
  context.fillRect(paddleX[1], 10, paddleWidth, paddleHeight);

  //* Dashed Center Line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();

  //* Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  //* Score
  context.font = '32px Helvetica';
  context.fillStyle = 'blue';
  context.fillText(score[0], 20, canvas.height / 2 + 50);
  context.fillStyle = 'green';
  context.fillText(score[1], 20, canvas.height / 2 - 30);
}
function paddleReset() {
  paddleX[paddleIndex] = width / 2 - paddleWidth / 2;
  socket.emit('paddleMove', {
    xPosition: paddleX[paddleIndex],
  });
  renderCanvas();
}
//* Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = 3;
  socket.emit('ballMove', {
    ballX,
    ballY,
    score,
  });
}

//* Adjust Ball Movement
function ballMove() {
  //* Vertical Speed
  ballY += speedY * ballDirection;
  //* Horizontal Speed
  if (playerMoved) {
    ballX += speedX;
  }
  socket.emit('ballMove', {
    ballX,
    ballY,
    score,
  });
}

function ballBoundaries() {
  //* Bounce off Left Wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }

  //* Bounce off Right Wall
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }

  //* Bounce off bottom player's paddle
  if (ballY > height - paddleDiff) {
    if (ballX >= paddleX[0] && ballX <= paddleX[0] + paddleWidth) {
      //* Add Speed on Hit
      speedY += 1;
      //* Max Speed
      if (speedY > 5) speedY = 5;
      ballDirection = -ballDirection;

      trajectoryX[0] = ballX - (paddleX[0] + paddleWidth / 2);
      speedX = trajectoryX[0] * 0.3;
    } else {
      //* If the ball misses the paddle, reset it and increase the top player's score
      ballReset();
      score[1]++;
    }
  }

  //* Bounce off top player's paddle
  if (ballY < paddleDiff) {
    if (ballX >= paddleX[1] && ballX <= paddleX[1] + paddleWidth) {
      //* Add Speed on Hit
      speedY += 1;
      //* Max Speed
      if (speedY > 5) speedY = 5;
      ballDirection = -ballDirection;

      trajectoryX[1] = ballX - (paddleX[1] + paddleWidth / 2);
      speedX = trajectoryX[1] * 0.3;
    } else {
      //* If the ball misses the paddle, reset it and increase the bottom player's score
      ballReset();
      score[0]++;
    }
  }
}

//* Called Every Frame
function animate() {
  if (!gameReady) {
    console.log('gameReady', gameReady);
    return;
  }
  //* Only the referee is updating the ball position
  if (isReferee) {
    ballMove();
    ballBoundaries();
  }
  renderCanvas();
  window.requestAnimationFrame(animate);
}

//* Load Game
function loadGame() {
  createCanvas();
  renderIntro();
  socket.emit('ready', playerStatus, gameReady);
  console.log('loadGame playerStatus', playerStatus);
}
// * Start Game, Reset Everything
function startGame() {
  preGameCountdown(() => {
    window.requestAnimationFrame(animate);
  });
  paddleIndex = isReferee ? 0 : 1;
  // paddleX = [225, 225];
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    paddleX = [225, 225];
    paddleX[paddleIndex] = e.offsetX;
    if (paddleX[paddleIndex] < 0) {
      paddleX[paddleIndex] = 0;
    }
    if (paddleX[paddleIndex] > width - paddleWidth) {
      paddleX[paddleIndex] = width - paddleWidth;
    }

    socket.emit('paddleMove', {
      xPosition: paddleX[paddleIndex],
    });
    // Hide Cursor
    canvas.style.cursor = 'none';
  });
}

//* Game Over!
function gameOver() {
  console.log('GAME OVER!', 'function');
  renderEnd();
  setTimeout(() => {
    playerStatus = true;
    gameReady = true;
    console.log('gameOver status', 'playerStatus', playerStatus, 'gameReady', gameReady);

    renderIntro();
    socket.emit('playerStatus', { gameReady, playerStatus, id: socket.id });
  }, 8000);
}

//* On Load
loadGame();

socket.on('connect', () => {
  console.log('Connected as...', socket.id);
});

socket.on('startGame', (refereeID) => {
  console.log('Referee is', refereeID);

  isReferee = socket.id === refereeID;
  console.log('Referee is', refereeID);
  startGame();
});

socket.on('paddleMove', (paddleData) => {
  const opponentPaddleIndex = 1 - paddleIndex;
  paddleX[opponentPaddleIndex] = paddleData.xPosition;
});

socket.on('ballMove', (ballData) => {
  //* Update ball data and score
  ({ ballX, ballY, score } = ballData);
});

socket.on('endGame', () => {
  console.log('GAME OVER!', 'script');
  isReferee = false;
  playerMoved = false;
  ballReset();
  paddleReset();
  gameReady = false;
  playerStatus = false;
  gameOver();
});
