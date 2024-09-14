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

// Vegan items image
const items = ['sandwich.png', 'wrap.png', 'salad.png'];
const basketImg = new Image();
basketImg.src = 'basket.png';

// Handle keyboard input
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

let rightPressed = false;
let leftPressed = false;

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

// Create falling items
function createFallingItem() {
  const item = {
    x: Math.random() * (canvas.width - 40),
    y: 0,
    width: 40,
    height: 40,
    dy: 3,
    img: new Image()
  };
  item.img.src = items[Math.floor(Math.random() * items.length)];
  fallingItems.push(item);
}

// Move the basket
function moveBasket() {
  if (rightPressed && basket.x < canvas.width - basket.width) {
    basket.x += basket.dx;
  }
  if (leftPressed && basket.x > 0) {
    basket.x -= basket.dx;
  }
}

// Draw the basket
function drawBasket() {
  ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
}

// Draw falling items
function drawItems() {
  fallingItems.forEach(item => {
    ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
  });
}

// Move falling items
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

// Update game state
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
    document.getElementById('score').innerText = score;
    document.getElementById('game-over').style.display = 'block';
  }
}

// Start the game
function startGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  fallingItems = [];
  setInterval(createFallingItem, 1000);
  update();
}

// Restart the game
function restartGame() {
  document.getElementById('game-over').style.display = 'none';
  startGame();
}

startGame();

console.log("JavaScript is working");

