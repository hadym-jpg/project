import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  setDirection,
  spawnFood,
  stepState
} from '../snakeLogic.js';

test('snake moves one tile on each step', () => {
  const state = createInitialState(() => 0);
  const moved = stepState(state, () => 0);

  assert.equal(moved.snake[0].x, state.snake[0].x + 1);
  assert.equal(moved.snake[0].y, state.snake[0].y);
});

test('snake grows and score increments when eating food', () => {
  const state = {
    ...createInitialState(() => 0),
    snake: [{ x: 5, y: 5 }],
    direction: 'right',
    pendingDirection: 'right',
    food: { x: 6, y: 5 }
  };

  const moved = stepState(state, () => 0);

  assert.equal(moved.snake.length, 2);
  assert.equal(moved.score, 1);
  assert.notDeepEqual(moved.food, state.food);
});

test('snake hits wall and game ends', () => {
  const state = {
    ...createInitialState(() => 0),
    snake: [{ x: 15, y: 0 }],
    direction: 'right',
    pendingDirection: 'right'
  };

  const moved = stepState(state, () => 0);

  assert.equal(moved.status, 'game-over');
});

test('reverse direction is ignored', () => {
  const state = {
    ...createInitialState(() => 0),
    direction: 'right',
    pendingDirection: 'right'
  };

  const changed = setDirection(state, 'left');

  assert.equal(changed.pendingDirection, 'right');
});

test('food spawns only on open cells', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 }
  ];

  const food = spawnFood(snake, 3, () => 0);

  assert.deepEqual(food, { x: 0, y: 1 });
});
