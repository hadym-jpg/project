import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  queueDirection,
  stepGame,
  placeFood,
} from '../src/snake.js';

test('snake moves one step in current direction', () => {
  const state = createInitialState(10);
  const next = stepGame(state);

  assert.deepEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.equal(next.snake.length, state.snake.length);
});

test('snake grows and increments score when eating food', () => {
  const state = createInitialState(10);
  const forced = {
    ...state,
    food: { x: state.snake[0].x + 1, y: state.snake[0].y },
  };

  const next = stepGame(forced);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, state.snake.length + 1);
});

test('cannot reverse direction immediately', () => {
  const state = createInitialState(10);
  const next = queueDirection(state, 'left');

  assert.equal(next.nextDirection, 'right');
});

test('collision with wall ends game', () => {
  const state = {
    ...createInitialState(4),
    snake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }],
    direction: 'right',
    nextDirection: 'right',
  };

  const next = stepGame(state);
  assert.equal(next.isGameOver, true);
});

test('food never spawns on snake body', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];
  const food = placeFood(snake, 2, () => 0);

  assert.deepEqual(food, { x: 1, y: 1 });
});
