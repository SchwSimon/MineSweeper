import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ResetButton, FACE } from '../../components/ResetButton';
import { resetBoard } from '../../actions/actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<ResetButton />', () => {
  const wrapper = shallow(<ResetButton />);
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
    expect(defaultState).toEqual({
      face: FACE.SMILE,
      rotateZ: 0
    });
  });

  describe('Lifecycle', () => {
    describe('componentWillReceiveProps()', () => {
      describe('isWin = isLose = false', () => {
        const rollStub = sinon.stub(wrapper.instance(), 'roll');

        wrapper.instance().componentWillReceiveProps({
          isWin: false,
          isLose: false
        });
        const faceState = wrapper.state().face;

        rollStub.restore();

        it('must call roll()', () => {
          expect(rollStub.called).toBeTruthy();
        });

        it('must set the state prop: face', () => {
          expect(faceState).toBe(FACE.SMILE);
        });
      });

      describe('isWin = true', () => {
        it('must set the state prop: face', () => {
          wrapper.instance().componentWillReceiveProps({
            isWin: true
          });

          expect(wrapper.state().face).toBe(FACE.WIN);
        });
      });

      describe('isLose = true', () => {
        it('must set the state prop: face', () => {
          wrapper.instance().componentWillReceiveProps({
            isWin: false,
            isLose: true
          });

          expect(wrapper.state().face).toBe(FACE.LOSE);
        });
      });
    });

    describe('component mount / unmount', () => {
      const addEventListenerStub = sinon.stub(window, 'addEventListener');
      const removeEventListenerStub = sinon.stub(window, 'removeEventListener');

      describe('componentWillMount()', () => {
        it('must add mouse- up/down event listeners', () => {
          wrapper.instance().componentWillMount();

          expect(addEventListenerStub.calledWith('mousedown', wrapper.instance().setFaceAttention, false)).toBeTruthy();
          expect(addEventListenerStub.calledWith('mouseup', wrapper.instance().setFaceSmile, false)).toBeTruthy();
        });
      });

      describe('componentWillUnmount()', () => {
        it('must add mouse- up/down event listeners', () => {
          wrapper.instance().componentWillUnmount();

          expect(removeEventListenerStub.calledWith('mousedown', wrapper.instance().setFaceAttention, false)).toBeTruthy();
          expect(removeEventListenerStub.calledWith('mouseup', wrapper.instance().setFaceSmile, false)).toBeTruthy();
        });
      });
    });
  });

  describe('component functionality', () => {
    describe('setFaceAttention()', () => {
      it('must set the state prop: face', () => {
        wrapper.setProps({
          isWin: false,
          isLose: false
        });
        wrapper.instance().setFaceAttention();

        expect(wrapper.state().face).toBe(FACE.ATTENTION);
      });
    });

    describe('setFaceSmile()', () => {
      it('must set the state prop: face', () => {
        wrapper.setProps({
          isWin: false,
          isLose: false
        });
        wrapper.instance().setFaceSmile();

        expect(wrapper.state().face).toBe(FACE.SMILE);
      });
    });

    describe('roll()', () => {
      it('must set the state prop: rotateZ', () => {
        wrapper.state().rotateZ = 100;
        wrapper.instance().roll();

        expect(wrapper.state().rotateZ).toBe(100 + 360);
      });
    });

    describe('onClick()', () => {
      it('must call dispatch with resetBoard()', () => {
        const dispatchSpy = sinon.spy();
        wrapper.setProps({
          dispatch: dispatchSpy
        });
        wrapper.find('.ResetButton-trigger').simulate('click');

        expect(dispatchSpy.calledWith(resetBoard())).toBeTruthy();
      });
    });
  });
});
