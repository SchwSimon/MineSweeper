import * as types from '../../actions/types';

describe('Action types', () => {
  it('RESET_BOARD', () => {
    expect(types.RESET_BOARD).toBe('RESET_BOARD');
  });

  it('BOX_REVEAL', () => {
    expect(types.BOX_REVEAL).toBe('BOX_REVEAL');
  });

  it('BOX_FLAG_TOGGLE', () => {
    expect(types.BOX_FLAG_TOGGLE).toBe('BOX_FLAG_TOGGLE');
  });

  it('SET_TIME_TICK', () => {
    expect(types.SET_TIME_TICK).toBe('SET_TIME_TICK');
  });

  it('SUBMIT_SETTINGS', () => {
    expect(types.SUBMIT_SETTINGS).toBe('SUBMIT_SETTINGS');
  });

  it('TOGGLE_SETTINGS', () => {
    expect(types.TOGGLE_SETTINGS).toBe('TOGGLE_SETTINGS');
  });
});
