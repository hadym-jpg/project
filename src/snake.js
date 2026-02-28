export const GRID_SIZE = 20;
export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createInitialState(gridSize = GRID_SIZE) {
  const center = Math.floor(gridSize / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    gridSize,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: placeFood(snake, gridSize),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function canTurn(currentDirection, nextDirection) {
  const current = DIRECTIONS[currentDirection];
  const next = DIRECTIONS[nextDirection];
  return !(current.x + next.x === 0 && current.y + next.y === 0);
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) return state;
  if (!canTurn(state.direction, nextDirection)) return state;
  return { ...state, nextDirection };
}

export function stepGame(state) {
  if (state.isGameOver || state.isPaused) return state;

  const direction = state.nextDirection;
  const head = state.snake[0];
  const delta = DIRECTIONS[direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (hitsWall(nextHead, state.gridSize) || hitsBody(nextHead, state.snake)) {
    return { ...state, direction, isGameOver: true };
  }

  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: ateFood ? placeFood(nextSnake, state.gridSize) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function setPaused(state, isPaused) {
  if (state.isGameOver) return state;
  return { ...state, isPaused };
}

export function togglePause(state) {
  return setPaused(state, !state.isPaused);
}

export function placeFood(snake, gridSize, random = Math.random) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const free = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }

  if (free.length === 0) {
    return snake[0];
  }

  const index = Math.floor(random() * free.length);
  return free[index];
}

function hitsWall(point, gridSize) {
  return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

function hitsBody(point, snake) {
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
}
