import * as acions from '../../actions/actions';
import * as types from '../../actions/types';

describe('Actions', () => {
  const data = 'data';

  it('resetBoard', () => {
    expect(acions.resetBoard()).toEqual({
      type: types.RESET_BOARD
    });
  });

  it('revealBox', () => {
    expect(acions.revealBox(data)).toEqual({
      type: types.BOX_REVEAL,
      payload: data
    });
  });

  it('flagBox', () => {
    expect(acions.flagBox()).toEqual({
      type: types.BOX_FLAG_TOGGLE
    });
  });

  it('setTimeTick', () => {
    expect(acions.setTimeTick()).toEqual({
      type: types.SET_TIME_TICK
    });
  });

  it('submitSettings', () => {
    expect(acions.submitSettings(data)).toEqual({
      type: types.SUBMIT_SETTINGS,
      payload: data
    });
  });

  it('toggleSettings', () => {
    expect(acions.toggleSettings()).toEqual({
      type: types.TOGGLE_SETTINGS
    });
  });
});
