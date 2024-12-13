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
    x: Math.random() * (canvas.width - 80),
    y: 0,
    width: 80,   // Double original size
    height: 80,  // Double original size
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

    // Check if item falls below the basket (missed)
    if (item.y + item.height > canvas.height) {
      fallingItems.splice(fallingItems.indexOf(item), 1);
      lives--;
      if (lives === 0) {
        gameOver = true;
      }
    }

    // Check if item is caught by the basket
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
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  document.getElementById('score').innerText = score;
  // No longer updating high score on the modal since it's removed
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
  let width = Math.min(window.innerWidth, 800);

  // If on mobile (width < 600), use full available height to make the game taller.
  // Otherwise, maintain original aspect ratio.
  if (width < 600) {
    // Mobile: use full device height
    var height = window.innerHeight;
  } else {
    // Desktop: maintain original aspect ratio of 800/600
    const aspectRatio = 800 / 600; 
    var height = width / aspectRatio;
  }

  canvas.width = width;
  canvas.height = height;

  // Update basket dimensions and position
  basket.width = canvas.width * 0.1 * 1.5;
  basket.height = canvas.height * 0.1 * 1.5;
  basket.y = canvas.height - basket.height - 10;
  basket.dx = canvas.width * 0.02; 

  // Update items size
  fallingItems.forEach(item => {
    item.width = canvas.width * 0.1;
    item.height = canvas.height * 0.1;
  });
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
startGame();
