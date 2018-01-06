import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GameTimer } from '../../components/GameTimer';
import { setTimeTick } from '../../actions/actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<GameTimer />', () => {
  const wrapper = shallow(<GameTimer />);
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
    expect(defaultState).toEqual({
      timer: null
    });
  });

  describe('Lifecycle', () => {
    describe('componentWillReceiveProps()', () => {
      it('must call startTimer()', () => {
        const startTimerStub = sinon.stub(wrapper.instance(), 'startTimer');
        wrapper.setProps({paused: true});

        wrapper.instance().componentWillReceiveProps({paused: false});

        startTimerStub.restore();

        expect(startTimerStub.called).toBeTruthy();
      });

      it('must call stopTimer()', () => {
        const stopTimerStub = sinon.stub(wrapper.instance(), 'startTimer');
        wrapper.setProps({paused: false});

        wrapper.instance().componentWillReceiveProps({paused: true});

        stopTimerStub.restore();

        expect(stopTimerStub.called).toBeTruthy();
      });
    });
  });

  describe('component functionality', () => {
    describe('startTimer()', () => {
      it('must set the state prop timer', () => {
        const setTimeoutStub = sinon.stub(window, 'setTimeout').returns('timeout');

        wrapper.instance().startTimer();

        setTimeoutStub.restore();

        expect(wrapper.state().timer).toBe('timeout');
      });
    });

    describe('stopTimer()', () => {
      it('must set the state prop timer', () => {
        wrapper.instance().stopTimer();

        expect(wrapper.state().timer).toBeNull();
      });
    });

    describe('tick()', () => {
      describe('state.time < 999', () => {
        const setTimeoutStub = sinon.stub(window, 'setTimeout').returns('timeout');
        const dispatchSpy = sinon.spy();
        wrapper.setProps({
          dispatch: dispatchSpy
        });
        wrapper.state().time = 0;
        wrapper.state().timer = true;

        wrapper.instance().tick();
        const stateTimer = wrapper.state().timer;

        setTimeoutStub.restore();

        it('must call dispatch with setTimeTick()', () => {
          expect(dispatchSpy.calledWith(setTimeTick())).toBeTruthy();
        });

        it('must set the state prop timer', () => {
          expect(stateTimer).toBe('timeout');
        });
      });

      describe('state.time >= 999', () => {
        it('must set the state prop timer', () => {
          const stopTimerStub = sinon.stub(wrapper.instance(), 'stopTimer');
          wrapper.state().timer = true;
          wrapper.state().time = 999;
          
          wrapper.instance().tick();

          expect(stopTimerStub.called).toBeTruthy();
        });
      });
    });
  });
});
