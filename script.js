const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = [];
let score = 0;
let gameInterval;
let gridSize = 20; // Ukuran grid
let gameStarted = false; // Menandai apakah game sudah dimulai atau belum

// Pengaturan Kecepatan Ular dan Jumlah Makanan
let snakeSpeed = 150; // Kecepatan ular
let foodCount = 5; // Jumlah makanan yang muncul

// Warna Tetap untuk Makanan
let foodColor = "red";

// Referensi Pop-up Game Over
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

// Gradien untuk ular
function createSnakeGradient() {
  let gradient = ctx.createLinearGradient(0, 0, gridSize, gridSize);
  gradient.addColorStop(0, "#6a994e");
  gradient.addColorStop(1, "#a7c957");
  return gradient;
}

// Menggambar ular dengan bentuk bulat
function drawSnake() {
  snake.forEach((part) => {
    ctx.beginPath();
    ctx.arc(
      part.x * gridSize + gridSize / 2,
      part.y * gridSize + gridSize / 2,
      gridSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = createSnakeGradient();
    ctx.fill();
    ctx.closePath();
  });
}

// Menggambar makanan dengan bentuk bulat
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

// Memindahkan ular
function moveSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Cek tabrakan dengan dinding atau dirinya sendiri
  if (
    newHead.x < 0 ||
    newHead.x >= canvas.width / gridSize ||
    newHead.y < 0 ||
    newHead.y >= canvas.height / gridSize ||
    snake.some((part) => part.x === newHead.x && part.y === newHead.y)
  ) {
    clearInterval(gameInterval);
    showGameOverPopup(); // Menampilkan pop-up saat game berakhir
    return;
  }

  snake.unshift(newHead);

  // Cek apakah ular memakan makanan
  let ateFood = false;
  food.forEach((f, index) => {
    if (newHead.x === f.x && newHead.y === f.y) {
      score++;
      document.getElementById("score").innerText = "Skor: " + score;
      food.splice(index, 1);
      spawnFood(); // Spawn makanan baru
      ateFood = true;
    }
  });

  if (!ateFood) {
    snake.pop();
  }
}

// Menyebarkan makanan secara acak
function spawnFood() {
  while (food.length < foodCount) {
    const newFood = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };

    // Pastikan makanan tidak muncul di atas ular
    if (!snake.some((part) => part.x === newFood.x && part.y === newFood.y)) {
      food.push(newFood);
    }
  }
}

// Menggambar permainan
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

// Mengatur arah ular
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

// Menampilkan pop-up Game Over
function showGameOverPopup() {
  finalScore.innerText = "Skor Akhir: " + score;
  gameOverPopup.style.display = "block";
}

// Memulai ulang game
restartBtn.addEventListener("click", () => {
  gameOverPopup.style.display = "none";
  resetGame();
});

// Fungsi untuk memulai permainan
function startGame() {
  gameStarted = true;
  spawnFood();
  gameInterval = setInterval(gameLoop, snakeSpeed);
}

// Fungsi untuk mereset permainan
function resetGame() {
  score = 0;
  document.getElementById("score").innerText = "Skor: " + score;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  food = [];
  gameStarted = false;
  clearInterval(gameInterval);
  draw(); // Gambar ulang permainan tanpa pergerakan
}

// Loop game
function gameLoop() {
  moveSnake();
  draw();
}

// Memulai permainan tanpa pergerakan (diam saja)
resetGame();
