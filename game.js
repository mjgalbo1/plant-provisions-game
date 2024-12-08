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

// Image assets
const items = ['sandwich.png', 'wrap.png', 'salad.png'];
const basketImg = new Image();
basketImg.src = 'basket.png';

basketImg.onload = function() {
  startGame();
};

const gameModal = document.getElementById('game-modal');
const scoreDisplay = document.getElementById('score');

// Event listeners for controls
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeCanvas);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
  if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
  if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
}

function resizeCanvas() {
  const aspectRatio = 800 / 600;
  const width = Math.min(window.innerWidth, 800);
  const height = width / aspectRatio;
  canvas.width = width;
  canvas.height = height;
}

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

function moveBasket() {
  if (rightPressed) basket.x += basket.dx;
  if (leftPressed) basket.x -= basket.dx;
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

    if (item.y + item.height > canvas.height) {
      fallingItems.splice(fallingItems.indexOf(item), 1);
      lives--;
      if (lives === 0) gameOver = true;
    }

    if (item.x > basket.x && item.x < basket.x + basket.width && item.y + item.height > basket.y) {
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
    requestAnimationFrame(update);
  } else {
    scoreDisplay.innerText = score;
    gameModal.style.display = 'flex';
  }
}

function startGame() {
  console.log("Game started");
  resizeCanvas();
  score = 0;
  lives = 3;
  gameOver = false;
  fallingItems = [];
  gameModal.style.display = 'none';
  setInterval(createFallingItem, 1000);
  update();
}
