import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  stepGame,
  togglePause,
} from './snake.js';

const TICK_MS = 130;
const boardEl = document.querySelector('#board');
const scoreEl = document.querySelector('#score');
const statusEl = document.querySelector('#status');
const restartBtn = document.querySelector('#restartBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const controlButtons = document.querySelectorAll('[data-dir]');

let state = createInitialState(GRID_SIZE);
let timer;

const keyToDirection = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

function buildGrid(gridSize) {
  boardEl.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    boardEl.appendChild(cell);
  }
}

function render() {
  const cells = boardEl.children;
  for (const cell of cells) {
    cell.className = 'cell';
  }

  state.snake.forEach((segment) => {
    const index = segment.y * state.gridSize + segment.x;
    cells[index]?.classList.add('snake');
  });

  const foodIndex = state.food.y * state.gridSize + state.food.x;
  cells[foodIndex]?.classList.add('food');

  scoreEl.textContent = String(state.score);
  if (state.isGameOver) {
    statusEl.textContent = 'Game over';
  } else if (state.isPaused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Running';
  }

  pauseBtn.textContent = state.isPaused ? 'Resume' : 'Pause';
}

function gameTick() {
  state = stepGame(state);
  render();

  if (state.isGameOver) {
    clearInterval(timer);
  }
}

function reset() {
  state = createInitialState(GRID_SIZE);
  render();
  clearInterval(timer);
  timer = setInterval(gameTick, TICK_MS);
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  const direction = keyToDirection[event.key] || keyToDirection[key];
  if (!direction) return;

  event.preventDefault();
  state = queueDirection(state, direction);
});

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state = queueDirection(state, button.dataset.dir);
  });
});

restartBtn.addEventListener('click', reset);
pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

buildGrid(GRID_SIZE);
reset();
