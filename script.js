const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = [];
let score = 0;
let gameInterval;
let gridSize = 20; 
let gameStarted = false;


let snakeSpeed = 150; 
let foodCount = 5;

let foodColor = "red";


const gameOverPopup = document.getElementById("gameOverPopup");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

function createSnakeBodyGradient() {
  let gradient = ctx.createLinearGradient(0, 0, gridSize, gridSize);
  gradient.addColorStop(0, "#6a994e");
  gradient.addColorStop(1, "#a7c957");
  return gradient;
}

let headColor = "#ff6347"; 

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.beginPath();
    if (index === 0) {

      ctx.arc(
        part.x * gridSize + gridSize / 2,
        part.y * gridSize + gridSize / 2,
        gridSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = headColor; 
    } else {
     
      ctx.arc(
        part.x * gridSize + gridSize / 2,
        part.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = createSnakeBodyGradient(); 
    }
    ctx.fill();
    ctx.closePath();
  });
}

function drawFood() {
  food.forEach((f) => {
    ctx.beginPath();
    ctx.arc(
      f.x * gridSize + gridSize / 2,
      f.y * gridSize + gridSize / 2,
      gridSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = foodColor;
    ctx.fill();
    ctx.closePath();
  });
}

function moveSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    newHead.x < 0 ||
    newHead.x >= canvas.width / gridSize ||
    newHead.y < 0 ||
    newHead.y >= canvas.height / gridSize ||
    snake.some((part) => part.x === newHead.x && part.y === newHead.y)
  ) {
    clearInterval(gameInterval);
    showGameOverPopup(); 
    return;
  }

  snake.unshift(newHead);

  let ateFood = false;
  food.forEach((f, index) => {
    if (newHead.x === f.x && newHead.y === f.y) {
      score++;
      document.getElementById("score").innerText = "Skor: " + score;
      food.splice(index, 1);
      spawnFood();
      ateFood = true;
    }
  });

  if (!ateFood) {
    snake.pop();
  }
}

function spawnFood() {
  while (food.length < foodCount) {
    const newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };

    if (!snake.some((part) => part.x === newFood.x && part.y === newFood.y)) {
      food.push(newFood);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

document.addEventListener("keydown", (event) => {
  if (!gameStarted && event.code === "Space") {
    startGame();
  } else if (gameStarted) {
    switch (event.key) {
      case "ArrowUp":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
    }
  }
});

function showGameOverPopup() {
  finalScore.innerText = "Skor Akhir: " + score;
  gameOverPopup.style.display = "block";
}

restartBtn.addEventListener("click", () => {
  gameOverPopup.style.display = "none";
  resetGame();
});

function startGame() {
  gameStarted = true;
  spawnFood();
  gameInterval = setInterval(gameLoop, snakeSpeed);
}

function resetGame() {
  score = 0;
  document.getElementById("score").innerText = "Skor: " + score;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = [];
  gameStarted = false;
  clearInterval(gameInterval);
  draw();
}

function gameLoop() {
  moveSnake();
  draw();
}

resetGame();
