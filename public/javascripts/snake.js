const GRID_SIZE = 30;
const board = document.getElementById('gameBoard');
let snake, direction, nextDirection, food, score, speed, gameInterval, isRunning;

// ------------------------------
// Utility Functions
// ------------------------------

// 隨機生成食物位置
function randomFood() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    };
}

// 處理邊緣傳送
function wrapPosition({ x, y }) {
    if (x < 0) x = GRID_SIZE - 1;
    if (x >= GRID_SIZE) x = 0;
    if (y < 0) y = GRID_SIZE - 1;
    if (y >= GRID_SIZE) y = 0;
    return { x, y };
}

// 檢查是否碰到自己
function isCollision({ x, y }) {
    return snake.some(seg => seg.x === x && seg.y === y);
}

// 計算新蛇頭位置
function moveSnake() {
    direction = { ...nextDirection };
    const head = snake[0];
    return wrapPosition({ x: head.x + direction.x, y: head.y + direction.y });
}

// ------------------------------
// Game Mechanics
// ------------------------------

// 初始化棋盤
function initBoard() {
    board.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}

// 處理吃食物邏輯，回傳是否吃到
function handleFood(head) {
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        food = randomFood();
        speed = Math.max(10, speed - 2);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
        return true;
    }
    return false;
}

// ------------------------------
// Update & Draw
// ------------------------------

// update
function update() {
    const newHead = moveSnake();
    if (isCollision(newHead)) {
        clearInterval(gameInterval);
        isRunning = false;
        alert('Game Over');
        return;
    }
    snake.unshift(newHead);
    if (!handleFood(newHead)) snake.pop();
}

// 依座標取得格子
function getCell(x, y) {
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

// 清空畫面上的蛇與食物
function clearBoard() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('snake', 'food'));
}

// 繪製食物
function drawFood() {
    const cell = getCell(food.x, food.y);
    if (cell) {
        cell.classList.add('food');
    }
}

// 繪製蛇身
function drawSnake() {
    for (const segment of snake) {
        const cell = getCell(segment.x, segment.y);
        if (cell) {
            cell.classList.add('snake');
        }
    }
}

// draw
function draw() {
    clearBoard();
    drawFood();
    drawSnake();
}

// ------------------------------
// Control Loop
// ------------------------------

// 遊戲主迴圈
function gameLoop() {
    if (!isRunning) return;
    update();
    draw();
}

// 開始遊戲
function startGame() {
    clearInterval(gameInterval);
    initBoard();
    snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
    direction = { x: 1, y: 0 };
    nextDirection = { ...direction };
    food = randomFood();
    score = 0;
    speed = 200;
    isRunning = true;
    document.getElementById('score').textContent = `Score: ${score}`;
    gameInterval = setInterval(gameLoop, speed);
}

// 暫停 / 繼續
function togglePause() {
    if (!isRunning) return;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    } else {
        gameInterval = setInterval(gameLoop, speed);
    }
}

// 鍵盤控制
function handleKey(e) {
    const dirs = {
        ArrowUp:    { x: 0, y: -1 },
        ArrowDown:  { x: 0, y: 1 },
        ArrowLeft:  { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };
    const newDir = dirs[e.code];
    if (newDir && (newDir.x + direction.x !== 0 || newDir.y + direction.y !== 0)) {
        nextDirection = newDir;
    }
}

// ------------------------------
// UI Binding & Init
// ------------------------------

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
window.addEventListener('keydown', handleKey);

initBoard();