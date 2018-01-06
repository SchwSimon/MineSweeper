import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SettingsButton } from '../../components/SettingsButton';
import { toggleSettings } from '../../actions/actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<SettingsButton />', () => {
  const wrapper = shallow(<SettingsButton />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  describe('component functionality', () => {
    describe('onClick()', () => {
      it('must set the state prop: face', () => {
        const dispatchSpy = sinon.spy();
        wrapper.setProps({
          dispatch: dispatchSpy
        });
        wrapper.instance().onClick();

        expect(dispatchSpy.calledWith(toggleSettings())).toBeTruthy();
      });
    });
  });
});
