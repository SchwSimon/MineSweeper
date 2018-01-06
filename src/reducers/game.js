import * as types from '../actions/types';
import { generateField } from './game/fieldGenerator';
import { floodField } from './game/floodField';
import { triggerBombs } from './game/triggerBombs';

export const initialState = {
  showSettings: false,        // toggle the settings menu
  pauseTimer: true,           // timer paused?
  time: 0,                    // the round time
  isWin: false,               // Winner
  isLose: false,              // Loser
  board: null,                // the board data
  triggeredBomb: {},          // the position of the triggered bomb
  bombAmount: 0,              // the amount of bombs to be spread on the field
  bombAmountFix: false,       // False: bombAmount -> %. True: bombAmount -> fix value
  bombCount: 0,               // the current amount of bombs
  flagCount: 0,               // the current amount of flags set
  boxCount: 0,                // the current amount of boxes
  revealCount: 0,             // the current amount of revealed (non-bomb) fields
  correctFlags: 0,            // the current amount of correct flags set
  floodSequence: [],          // flooding sequence
  floodRevealTimeOffset: 0,   // a reveal time offset used by the boxes
  dimension: {                // the board dimensions
    yMax: 24,
    xMax: 30
  },
  boxSize: 0,                 // box client width (pixel)
  boxPadding: 0               // box border width (pixel)
};

export default (state = initialState, action) => {
  switch(action.type) {
    case types.SET_TIME_TICK:
      return {
        ...state,
        time: state.time + 1
      };

    case types.RESET_BOARD: {
      const newBoardData = generateField(state.dimension, state.bombAmount, state.bombAmountFix);
      return {
        ...state,
        pauseTimer: true,
        time: 0,
        isWin: false,
        isLose: false,
        board: newBoardData.field,
        triggeredBomb: {},
        bombCount: newBoardData.bombCount,
        flagCount: 0,
        revealCount: 0,
        boxCount: state.dimension.yMax * state.dimension.xMax,
        correctFlags: 0,
        floodSequence: []
      };
    }

    case types.BOX_REVEAL: {
      const board = state.board.map(row => row.map(col => ({...col})));
      let pauseTimer = false;
      let isLose = false;
      let isWin = false;
      let floodSequence;
      let triggeredBomb;
      let revealCount = state.revealCount;

        // reveal this field
      board[action.payload.y][action.payload.x].revealed = true;
        // increment the revealed box count
      revealCount++;

      if (board[action.payload.y][action.payload.x].bomb) {
          // trigger all bombs
        triggerBombs(board);
          // the position of the triggered bomb
        triggeredBomb = {...action.payload};
          // pause the timer
        pauseTimer = true;
          // set game lost
        isLose = true;
      } else if (board[action.payload.y][action.payload.x].hint === 0) {
          // flood empty fields
        floodSequence = floodField(board, action.payload.y, action.payload.x);
          // concat the amount of revealed boxes by the flood
        revealCount += floodSequence.length;
      }

        // if all non-bomb boxes are revealed trigger winning
      if (!isLose && revealCount === (state.boxCount - state.bombCount)) {
          // pause the timer
        pauseTimer = true;
          // set game win
        isWin = true;
      }

      return {
        ...state,
        board: board,
        pauseTimer: pauseTimer,
        isLose: isLose,
        isWin: isWin,
        triggeredBomb: triggeredBomb || state.triggeredBomb,
        floodSequence: floodSequence || state.floodSequence,
        revealCount: revealCount
      }
    }

    case types.BOX_FLAG_TOGGLE: {
        // make sure the box is not revealed
      if (state.board[action.payload.y][action.payload.x].revealed)
        return state;

      const board = state.board.map(row => row.map(col => ({...col})));

      let flagCount = state.flagCount;
      let correctFlags = state.correctFlags;

      if (!board[action.payload.y][action.payload.x].flagged) {
          // increment the amount of correct flags set
        if (board[action.payload.y][action.payload.x].bomb)
          correctFlags++;

          // set the box flag
        board[action.payload.y][action.payload.x].flagged = true;
          // increment the global flag count
        flagCount++;
      } else {
          // decrement the amount of correct flags set
        if (board[action.payload.y][action.payload.x].bomb)
          correctFlags--;

          // unset the box flag
        board[action.payload.y][action.payload.x].flagged = false;
          // decrement the global flag count
        flagCount--;
      }

        // if the amount of correct flags set equals the amount of bombs
        // and the amount flags set
        // then pause the timer and set game win
      let pauseTimer = false;
      let isWin = false;
      if (correctFlags === state.bombCount && correctFlags === flagCount)
        pauseTimer = isWin = true;

      return {
        ...state,
        board: board,
        flagCount: flagCount,
        correctFlags: correctFlags,
        pauseTimer: pauseTimer,
        isWin: isWin
      };
    }

    case types.TOGGLE_SETTINGS:
      return {
        ...state,
        showSettings: !state.showSettings
      };

    case types.SUBMIT_SETTINGS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};
