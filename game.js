const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let basket = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 60,
  width: 80,
  height: 40,
  dx: 7
};
let fallingItems = [];
let score = 0;
let lives = 3;
let gameOver = false;
let highScore = localStorage.getItem('highScore') || 0;

// Updated items to tomato, carrot, beet, pepper
const items = ['tomato.png', 'carrot.png', 'beet.png', 'pepper.png'];
const basketImg = new Image();
basketImg.src = 'basket.png';

// Keyboard controls
let rightPressed = false;
let leftPressed = false;

// Mobile button controls
let isMovingLeft = false;
let isMovingRight = false;

// Handle keyboard input
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Mobile button event listeners
document.getElementById('leftBtn').addEventListener('touchstart', function() {
  isMovingLeft = true;
});
document.getElementById('leftBtn').addEventListener('touchend', function() {
  isMovingLeft = false;
});

document.getElementById('rightBtn').addEventListener('touchstart', function() {
  isMovingRight = true;
});
document.getElementById('rightBtn').addEventListener('touchend', function() {
  isMovingRight = false;
});

function createFallingItem() {
  const item = {
    x: Math.random() * (canvas.width - 40),
    y: 0,
    width: 40,   // Set to a square dimension
    height: 40,  // to maintain a 1:1 aspect ratio
    dy: 3,
    img: new Image()
  };
  item.img.src = items[Math.floor(Math.random() * items.length)];
  fallingItems.push(item);
}

function moveBasket() {
  if (rightPressed || isMovingRight) {
    if (basket.x < canvas.width - basket.width) {
      basket.x += basket.dx;
    }
  }
  if (leftPressed || isMovingLeft) {
    if (basket.x > 0) {
      basket.x -= basket.dx;
    }
  }
}

function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

function drawItems() {
  fallingItems.forEach(item => {
    ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
  });
}

function moveItems() {
  fallingItems.forEach(item => {
    item.y += item.dy;

    // Check if item falls below the basket
    if (item.y + item.height > canvas.height) {
      fallingItems.splice(fallingItems.indexOf(item), 1);
      lives--;
      if (lives === 0) {
        gameOver = true;
      }
    }

    // Check if item is caught
    if (
      item.x > basket.x &&
      item.x < basket.x + basket.width &&
      item.y + item.height > basket.y &&
      item.y < basket.y + basket.height
    ) {
      fallingItems.splice(fallingItems.indexOf(item), 1);
      score++;
    }
  });
}

function update() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveBasket();
    moveItems();
    drawBasket();
    drawItems();
    ctx.font = '20px Arial';
    ctx.fillStyle = '#388e3c';
    ctx.fillText('Score: ' + score, 10, 20);
    ctx.fillText('Lives: ' + lives, 10, 50);

    requestAnimationFrame(update);
  } else {
    endGame();
  }
}

function endGame() {
  // Update high score if current score is higher
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  document.getElementById('score').innerText = score;
  document.getElementById('high-score').innerText = highScore;
  document.getElementById('hidden-score').value = score;
  document.getElementById('game-over').style.display = 'flex';
}

function startGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  fallingItems = [];
  setInterval(createFallingItem, 1000);
  update();
}

function restartGame() {
  document.getElementById('game-over').style.display = 'none';
  startGame();
}

function resizeCanvas() {
  const aspectRatio = 800 / 600; 
  const width = Math.min(window.innerWidth, 800); 
  const height = width / aspectRatio;

  canvas.width = width;
  canvas.height = height;

  // Make the basket 1.5x bigger than before
  basket.width = canvas.width * 0.1 * 1.5;     // originally 0.1
  basket.height = canvas.height * 0.1 * 1.5;  // originally 0.07
  basket.y = canvas.height - basket.height - 10;
  basket.dx = canvas.width * 0.02; 

  fallingItems.forEach(item => {
    item.width = canvas.width * 0.05;
    item.height = canvas.height * 0.05;
  });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
startGame();