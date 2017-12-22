import * as types from './types';

export const resetBoard = () => ({
	type: types.RESET_BOARD
});

export const revealBox = (position) => ({
  type: types.BOX_REVEAL,
  payload: position
});

export const flagBox = (position) => ({
  type: types.BOX_FLAG_TOGGLE,
  payload: position
});

export const setTimeTick = () => ({
  type: types.SET_TIME_TICK
});

export const submitSettings = (settings) => ({
	type: types.SUBMIT_SETTINGS,
	payload: settings
});

export const toggleSettings = () => ({
	type: types.TOGGLE_SETTINGS
});
