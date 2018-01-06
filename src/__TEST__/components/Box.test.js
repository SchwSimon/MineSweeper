import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Box } from '../../components/Box';
import { revealBox, flagBox } from '../../actions/actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<Box />', () => {
  const wrapper = shallow(<Box />);
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
    expect(defaultState).toEqual({
      active: false,
      revealed: false
    });
  });

  describe('Lifecycle', () => {
    describe('componentWillReceiveProps()', () => {
      describe('nextProps.revealed != this.props.revealed', () => {
        describe('nextProps.revealed = true', () => {
          it('must set the state props correctly', () => {
            wrapper.setProps({revealed: true});
            wrapper.state().active = true;
            wrapper.state().revealed = true;

            wrapper.instance().componentWillReceiveProps({revealed: false})

            expect(wrapper.state()).toMatchObject({
              active: false,
              revealed: false
            });
          });
        });

        describe('nextProps.revealed = true', () => {
          describe('nextProps.revealTimeOffset > 0', () => {
            it('must call setTimeout with correct args', () => {
              const setTimeoutStub = sinon.stub(window, 'setTimeout');
              wrapper.setProps({revealed: false});
              wrapper.state().revealed = false;

              wrapper.instance().componentWillReceiveProps({
                revealed: true,
                revealTimeOffset: 3,
                revealIndex: 3
              });

              setTimeoutStub.restore();

              expect(setTimeoutStub.calledWith(wrapper.instance().reveal, 3*3)).toBeTruthy();
            });
          });

          describe('nextProps.revealTimeOffset <= 0', () => {
            it('must call reveal() with the arg: true', () => {
              const revealStub = sinon.stub(wrapper.instance(), 'reveal');
              wrapper.state().revealed = false;

              wrapper.instance().componentWillReceiveProps({
                revealed: true,
                revealTimeOffset: 0
              });

              revealStub.restore();

              expect(revealStub.calledWith(true)).toBeTruthy();
            });
          });
        });
      });
    });

    describe('shouldComponentUpdate()', () => {
      let nextState;
      let nextProps;
      beforeEach(() => {
        nextState = {active: true, revealed: true};
        nextProps = {flagged: true, boxSize: true}
        wrapper.setProps({flagged: true, boxSize: true});
        wrapper.state().active = true;
        wrapper.state().revealed = true;
      });

      it('must return true', () => {
        nextState.active = false;
        expect(wrapper.instance().shouldComponentUpdate(nextProps, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextState.revealed = false;
        expect(wrapper.instance().shouldComponentUpdate(nextProps, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextProps.flagged = false;
        expect(wrapper.instance().shouldComponentUpdate(nextProps, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextProps.boxSize = false;
        expect(wrapper.instance().shouldComponentUpdate(nextProps, nextState)).toBe(true);
      });

      it('must return false', () => {
        expect(wrapper.instance().shouldComponentUpdate(nextProps, nextState)).toBe(false);
      });
    });
  });

  describe('component functionality', () => {
    const boxNode = wrapper.find('.MineSweeper-box');

    describe('onMouseEnter()', () => {
      it('must set the state prop: active to true', () => {
        wrapper.state().active = false;
        wrapper.setProps({
          flagged: false,
          revealed: false
        });

        boxNode.simulate('mouseenter', {buttons: 1});

        expect(wrapper.state().active).toBe(true);
      });
    });

    describe('onMouseDown()', () => {
      describe('event.buttons = 2', () => {
        it('must call dispatch with flagBox()', () => {
          const dispatchSpy = sinon.spy();
          wrapper.state().active = false;
          wrapper.setProps({
            dispatch: dispatchSpy,
            revealed: false,
            x: 22,
            y: 33
          });

          boxNode.simulate('mousedown', {buttons: 2});

          expect(dispatchSpy.calledWith(flagBox({x: 22, y: 33}))).toBeTruthy();
        });
      });

      describe('event.buttons = 1', () => {
        it('must set the state prop: active to true', () => {
          wrapper.state().active = false;
          wrapper.setProps({
            revealed: false,
            flagged: false
          });

          boxNode.simulate('mousedown', {buttons: 1});

          expect(wrapper.state().active).toBe(true);
        });
      });
    });

    describe('onMouseUp()', () => {
      const revealStub = sinon.stub(wrapper.instance(), 'reveal');
      const onRevealStub = sinon.stub(wrapper.instance(), 'onReveal');
      wrapper.setProps({
        revealed: false,
        flagged: false
      });

      boxNode.simulate('mouseup', {});

      revealStub.restore();
      onRevealStub.restore();

      it('must call reveal with arg: true', () => {
        expect(revealStub.calledWith(true)).toBeTruthy();
      });

      it('must call onReveal', () => {
        expect(onRevealStub.called).toBeTruthy();
      });
    });

    describe('onMouseOut()', () => {
      it('must set the state prop: active to false', () => {
        wrapper.state().active = true;
        wrapper.setProps({
          revealed: false,
          flagged: false
        });

        boxNode.simulate('mouseout');

        expect(wrapper.state().active).toBe(false);
      });
    });

    describe('onClick()', () => {
      it('must call onReveal()', () => {
        const onRevealStub = sinon.stub(wrapper.instance(), 'onReveal');
        wrapper.setProps({
          revealed: false,
          flagged: false
        });

        boxNode.simulate('click');

        onRevealStub.restore();

        expect(onRevealStub.called).toBeTruthy();
      });
    });

    describe('onReveal()', () => {
      it('must call dispatch with revealBox()', () => {
        const dispatchSpy = sinon.spy();
        wrapper.setProps({
          dispatch: dispatchSpy,
          x: 11,
          y: 22
        });

        wrapper.instance().onReveal();

        expect(dispatchSpy.calledWith(revealBox({x: 11, y: 22}))).toBeTruthy();
      });
    });

    describe('reveal()', () => {
      it('must set the correct state props', () => {
        wrapper.setProps({revealed: false})
        wrapper.state().revealed = null;
        wrapper.state().active = true;

        wrapper.instance().reveal();

        expect(wrapper.state()).toMatchObject({
          revealed: false,
          active: false
        });
      });
    });
  });
});
