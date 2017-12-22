import * as types from '../../actions/types';
import reducer, { initialState } from '../../reducers/game';
import { generateField } from '../../reducers/game/fieldGenerator';
import { floodField } from '../../reducers/game/floodField';

describe('Game reducer', () => {
  it('initial state', () => {
    expect(initialState).toEqual({
      showSettings: false,
      pauseTimer: true,
      time: 0,
      isWin: false,
      isLose: false,
      board: null,
      triggeredBomb: {},
      bombAmount: 0,
      bombAmountFix: false,
      bombCount: 0,
      flagCount: 0,
      boxCount: 0,
      revealCount: 0,
      correctFlags: 0,
      floodSequence: [],
      floodRevealTimeOffset: 0,
      dimension: {yMax: 24,xMax: 30},
      boxSize: 0,
      boxPadding: 0
    });
  });

  it('must return default on default action type', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('SET_TIME_TICK', () => {
    expect(reducer(undefined, {type: types.SET_TIME_TICK})).toEqual({
      ...initialState,
      time: initialState.time + 1
    });
  });

  it('RESET_BOARD', () => {
    const newBoardData = generateField(initialState.dimension, initialState.bombAmount, initialState.bombAmountFix);
    const newState = reducer(undefined, {type: types.RESET_BOARD});
    expect(newState).toMatchObject({
      pauseTimer: true,
      time: 0,
      isWin: false,
      isLose: false,
      triggeredBomb: {},
      bombCount: newBoardData.bombCount,
      flagCount: 0,
      revealCount: 0,
      boxCount: initialState.dimension.yMax * initialState.dimension.xMax,
      correctFlags: 0,
      floodSequence: []
    });
    expect(newState.board).toHaveLength(newBoardData.field.length);
  });

  describe('BOX_REVEAL', () => {
    const iy = 1;
    const ix = 2;
    const action = {
      type: types.BOX_REVEAL,
      payload: {y: iy, x: ix}
    };

    const manipulateBoxBlock = (board, func) => {
      for(let y = iy-1; y < iy+2; y++) {
        for(let x = ix-1; x < ix+2; x++) {
          func(board[y][x]);
        }
      }
    }

    it.only('must reveal a default box and trigger win (no hint, no bomb)', () => {
      const boardData = generateField(initialState.dimension, 100);
      const board = boardData.field;

      manipulateBoxBlock(board, box => {
        box.bomb = false;
        box.hint = 1;
      });

      board[iy][ix].hint = 0;

      const state = {
        ...initialState,
        bombCount: boardData.bombCount - 9,
        boxCount: initialState.dimension.yMax * initialState.dimension.xMax,
        board: board
      };

      const newBoard = board.map(row => row.map(col => ({...col})));
      manipulateBoxBlock(newBoard, box => {
        box.revealed = true;
      });

      const newState = reducer(state, action);
      delete state.floodSequence;

      expect(newState).toMatchObject({
        ...state,
        board: newBoard,
        pauseTimer: true,
        isLose: false,
        isWin: true,
        revealCount: 9
      });
      expect(newState.floodSequence).toHaveLength(8);
    });

    it('must reveal a bomb and trigger lose', () => {
      const boardData = generateField(initialState.dimension, 1, true);
      const bombCount = boardData.bombCount + ((boardData[y][x].bomb) ? 0 : 1);
      boardData[y][x].bomb = true;

      const state = {
        ...initialState,
        bombAmount: bombCount,
        boxCount: initialState.dimension.yMax * initialState.dimension.xMax,
        bombAmountFix: true,
        board: [...boardData]
      };

      expect(reducer(state, action)).toEqual({
        ...state,
        board: newBoardData,
        pauseTimer: true,
        isLose: true,
        isWin: false,
        revealCount: state.revealCount + 1
      });
    });
  });

  it('SET_TIME_TICK', () => {
    expect(reducer(undefined, {type: types.SET_TIME_TICK})).toEqual({
      ...initialState,
      time: initialState.time + 1
    });
  });

  it('SET_TIME_TICK', () => {
    expect(reducer(undefined, {type: types.SET_TIME_TICK})).toEqual({
      ...initialState,
      time: initialState.time + 1
    });
  });


});
