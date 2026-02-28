import {
  GRID_SIZE,
  createInitialState,
  restartState,
  setDirection,
  stepState
} from './snakeLogic.js';

const board = document.querySelector('#board');
const scoreEl = document.querySelector('#score');
const statusEl = document.querySelector('#status');
const pauseBtn = document.querySelector('#pause');
const restartBtn = document.querySelector('#restart');
const controlButtons = Array.from(document.querySelectorAll('[data-action]'));

let state = createInitialState();
let paused = false;

function keyToDirection(key) {
  const map = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right'
  };

  return map[key];
}

function render() {
  board.innerHTML = '';
  const snakeCells = new Set(state.snake.map(({ x, y }) => `${x},${y}`));
  const foodCell = state.food ? `${state.food.x},${state.food.y}` : null;
  const fragment = document.createDocumentFragment();

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const key = `${x},${y}`;
      if (snakeCells.has(key)) {
        cell.classList.add('snake');
      } else if (foodCell === key) {
        cell.classList.add('food');
      }
      fragment.appendChild(cell);
    }
  }

  board.appendChild(fragment);

  scoreEl.textContent = String(state.score);
  statusEl.textContent = paused
    ? 'Paused'
    : state.status === 'running'
      ? 'Running'
      : state.status === 'won'
        ? 'You won!'
        : 'Game over';
}

function togglePause() {
  if (state.status !== 'running') {
    return;
  }

  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  render();
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
    togglePause();
    return;
  }

  const direction = keyToDirection(event.key);
  if (direction) {
    event.preventDefault();
    state = setDirection(state, direction);
  }

  if (event.key === 'Enter' && state.status !== 'running') {
    state = restartState(state);
    paused = false;
    pauseBtn.textContent = 'Pause';
    render();
  }
});

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state = setDirection(state, button.dataset.action);
  });
});

pauseBtn.addEventListener('click', togglePause);

restartBtn.addEventListener('click', () => {
  state = restartState(state);
  paused = false;
  pauseBtn.textContent = 'Pause';
  render();
});

setInterval(() => {
  if (paused || state.status !== 'running') {
    return;
  }

  state = stepState(state);
  render();
}, 140);

render();
