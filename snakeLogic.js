export const GRID_SIZE = 16;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

export function randomInt(max, randomFn = Math.random) {
  return Math.floor(randomFn() * max);
}

export function spawnFood(snake, gridSize = GRID_SIZE, randomFn = Math.random) {
  const occupied = new Set(snake.map(({ x, y }) => `${x},${y}`));
  const available = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return null;
  }

  return available[randomInt(available.length, randomFn)];
}

export function createInitialState(randomFn = Math.random, gridSize = GRID_SIZE) {
  const mid = Math.floor(gridSize / 2);
  const snake = [{ x: mid, y: mid }];

  return {
    gridSize,
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: spawnFood(snake, gridSize, randomFn),
    score: 0,
    status: 'running'
  };
}

export function setDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection] || state.status !== 'running') {
    return state;
  }

  if (OPPOSITES[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection
  };
}

function isOutsideBoard({ x, y }, gridSize) {
  return x < 0 || y < 0 || x >= gridSize || y >= gridSize;
}

function isSelfCollision(head, body) {
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function stepState(state, randomFn = Math.random) {
  if (state.status !== 'running') {
    return state;
  }

  const vector = DIRECTIONS[state.pendingDirection];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };

  if (isOutsideBoard(nextHead, state.gridSize) || isSelfCollision(nextHead, state.snake)) {
    return {
      ...state,
      status: 'game-over',
      direction: state.pendingDirection
    };
  }

  const ateFood = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  const nextFood = ateFood ? spawnFood(nextSnake, state.gridSize, randomFn) : state.food;

  return {
    ...state,
    snake: nextSnake,
    direction: state.pendingDirection,
    food: nextFood,
    score: state.score + (ateFood ? 1 : 0),
    status: nextFood ? 'running' : 'won'
  };
}

export function restartState(state, randomFn = Math.random) {
  return createInitialState(randomFn, state.gridSize);
}
