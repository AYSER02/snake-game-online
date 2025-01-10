const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Snake and food
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let borderMode = true; // Default to border mode

// DOM elements
const menu = document.getElementById("menu");
const borderModeButton = document.getElementById("borderMode");
const borderlessModeButton = document.getElementById("borderlessMode");
const gameContainer = document.querySelector(".game-container");

// Event listeners for mode selection
borderModeButton.addEventListener("click", () => {
  borderMode = true;
  startGame();
});

borderlessModeButton.addEventListener("click", () => {
  borderMode = false;
  startGame();
});

// Start the game
function startGame() {
  menu.style.display = "none"; // Hide the menu
  gameContainer.style.display = "block"; // Show the game
  resetGame();
  gameLoop();
}

// Game loop
function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 100);
}

// Update game state
function update() {
  // Move snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Border mode: Check for collision with borders
  if (borderMode) {
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      resetGame();
      return;
    }
  } else {
    // Borderless mode: Wrap around the canvas
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
  }

  // Check for collision with itself
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
    return;
  }

  // Add new head
  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    // Update high score if current score is higher
    if (score > highScore) {
      highScore = score;
    }
    placeFood();
  } else {
    // Remove tail
    snake.pop();
  }
}

// Draw game elements
function draw() {
  // Clear canvas
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);

  // Draw borders if in border mode
  if (borderMode) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }
}

// Place food randomly
function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  // Ensure food doesn't spawn on the snake
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    placeFood();
  }
}

// Reset game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  placeFood();
}

// Handle keyboard input
window.addEventListener("keydown", e => {
  switch (e.key ) {
    // Arrow keys
    case "ArrowUp":
    case "w": // WASD support
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
    case "s": // WASD support
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
    case "a": // WASD support
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
    case "d": // WASD support
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Start the game
placeFood();
gameLoop();