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

  describe('SET_TIME_TICK', () => {
    it('must tick +1 second', () => {
      expect(reducer(undefined, {type: types.SET_TIME_TICK})).toEqual({
        ...initialState,
        time: initialState.time + 1
      });
    });
  });

  describe('RESET_BOARD', () => {
    it('must reset the board and game stats', () => {
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
  });

  describe('BOX_REVEAL', () => {
    const iy = 1;
    const ix = 2;
    const action = {
      type: types.BOX_REVEAL,
      payload: {y: iy, x: ix}
    };

    it('must reveal a default box and trigger win (no hint, no bomb)', () => {
      const manipulateBoxBlock = (board, func) => {
        for(let y = iy-1; y < iy+2; y++) {
          for(let x = ix-1; x < ix+2; x++) {
            func(board[y][x]);
          }
        }
      };
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
        // to not compare this on expect
      delete state.floodSequence;

      const newBoard = board.map(row => row.map(col => ({...col})));
      manipulateBoxBlock(newBoard, box => {
        box.revealed = true;
      });

      const newState = reducer(state, action);

      expect(newState).toMatchObject({
        ...state,
        board: newBoard,
        pauseTimer: true,
        isLose: false,
        isWin: true,
        triggeredBomb: {},
        revealCount: 9
      });
      expect(newState.floodSequence).toHaveLength(8);
    });

    it('must reveal a bomb and trigger lose', () => {
      const boardData = generateField(initialState.dimension, 1, true);
      const board = boardData.field;

      board.forEach(row => row.forEach(col => col.bomb = false));

      board[iy][ix].bomb = true;
      board[iy][ix].revealed = true;

      const state = {
        ...initialState,
        bombAmount: 1,
        boxCount: initialState.dimension.yMax * initialState.dimension.xMax,
        bombAmountFix: true,
        board: board
      };

      expect(reducer(state, action)).toEqual({
        ...state,
        board: board,
        pauseTimer: true,
        isLose: true,
        isWin: false,
        triggeredBomb: {
          y: iy,
          x: ix
        },
        floodSequence: [],
        revealCount: 1
      });
    });

    it('must reveal a hint box', () => {
      const boardData = generateField(initialState.dimension, 50);
      const board = boardData.field;

      board[iy][ix].bomb = false;
      board[iy][ix].revealed = true;
      board[iy][ix].hint = 3;

      const state = {
        ...initialState,
        board: board
      };

      expect(reducer(state, action)).toEqual({
        ...state,
        board: board,
        pauseTimer: false,
        isLose: false,
        isWin: false,
        triggeredBomb: {},
        floodSequence: [],
        revealCount: 1
      });
    });
  });

  describe('BOX_FLAG_TOGGLE', () => {
    const iy = 1;
    const ix = 2;
    const action = {
      type: types.BOX_FLAG_TOGGLE,
      payload: {y: iy, x: ix}
    };

    it('must set a flag', () => {
      const boardData = generateField(initialState.dimension, 50);
      const board = boardData.field;

      board[iy][ix].bomb = false;

      const state = {
        ...initialState,
        board: board
      };

      const newBoard = board.map(row => row.map(col => ({...col})));
      newBoard[iy][ix].flagged = true;

      expect(reducer(state, action)).toEqual({
        ...state,
        board: newBoard,
        flagCount: 1,
        correctFlags: 0,
        pauseTimer: false,
        isWin: false
      });
    });

    it('must set a flag and trigger win', () => {
      const boardData = generateField(initialState.dimension, 1, true);
      const board = boardData.field;

      board[iy][ix].bomb = true;

      const state = {
        ...initialState,
        bombCount: 1,
        board: board
      };

      const newBoard = board.map(row => row.map(col => ({...col})));
      newBoard[iy][ix].flagged = true;

      expect(reducer(state, action)).toEqual({
        ...state,
        board: newBoard,
        flagCount: 1,
        correctFlags: 1,
        pauseTimer: true,
        isWin: true
      });
    });

    it('must remove a flag', () => {
      const boardData = generateField(initialState.dimension, 5, true);
      const board = boardData.field;

      board[iy][ix].flagged = true;
      board[iy][ix].bomb = true;

      const state = {
        ...initialState,
        flagCount: 1,
        correctFlags: 1,
        bombCount: 5,
        board: board
      };

      const newBoard = board.map(row => row.map(col => ({...col})));
      newBoard[iy][ix].flagged = false;

      expect(reducer(state, action)).toEqual({
        ...state,
        board: newBoard,
        flagCount: 0,
        correctFlags: 0,
        pauseTimer: false,
        isWin: false
      });
    });
  });

  describe('TOGGLE_SETTINGS', () => {
    it('must toggle showSettings', () => {
      const action = {
        type: types.TOGGLE_SETTINGS,
        payload: false
      };
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        showSettings: true
      });
    });
  });

  describe('SUBMIT_SETTINGS', () => {
    it('must override all state prop which are given from the payload', () => {
      const action = {
        type: types.SUBMIT_SETTINGS,
        payload: {
          bombCount: 33,
          flagCount: 33,
          boxCount: 33,
          boxSize: 33,
          boxPadding: 33
        }
      };
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        bombCount: 33,
        flagCount: 33,
        boxCount: 33,
        boxSize: 33,
        boxPadding: 33
      });
    });
  });
});
