import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GameSettings } from '../../components/GameSettings';
import { toggleSettings, resetBoard, submitSettings } from '../../actions/actions';

Enzyme.configure({ adapter: new Adapter() });

describe('<GameSettings />', () => {
  const MathMinStub = sinon.stub(window.Math, 'min').returns(250);
  const wrapper = shallow(<GameSettings />, {
    disableLifecycleMethods: true
  });
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('default state', () => {
    expect(defaultState).toEqual({
      dimension: {
        xMax: 250 - 1,
        yMax: 250
      },
      bombsPercent: 12,
      bombsFixed: 10,
      bombAmountFix: false,
      boxSize: 20,
      boxPadding: 4,
      floodRevealTimeOffset: 10
    });
  });

  describe('Lifecycle', () => {
    describe('componentDidMount()', () => {
      it('must call onSubmit', () => {
        const onSubmitStub = sinon.stub(wrapper.instance(), 'onSubmit');
        wrapper.instance().componentDidMount();
        onSubmitStub.restore();

        expect(onSubmitStub.called).toBeTruthy();
      });
    });
  });

  describe('component functionality', () => {
    describe('onXMaxChange()', () => {
      it('must set the state prop dimension.xMax', () => {
        wrapper.instance().onXMaxChange({target: {value: 22}});

        expect(wrapper.state().dimension.xMax).toBe(22);
      });
    });

    describe('onXMaxChange()', () => {
      it('must set the state prop dimension.xMax', () => {
        wrapper.instance().onYMaxChange({target: {value: 33}});

        expect(wrapper.state().dimension.yMax).toBe(33);
      });
    });

    describe('onBombAmountPercentChange()', () => {
      it('must set the state prop bombsPercent', () => {
        wrapper.instance().onBombAmountPercentChange({target: {value: 44}});

        expect(wrapper.state().bombsPercent).toBe(44);
      });
    });

    describe('onBombAmountFixedChange()', () => {
      it('must set the state prop bombsFixed', () => {
        wrapper.instance().onBombAmountFixedChange({target: {value: 55}});

        expect(wrapper.state().bombsFixed).toBe(55);
      });
    });

    describe('onBombAmountTypeChange()', () => {
      it('must set the state prop bombAmountFix to true', () => {
        wrapper.instance().onBombAmountTypeChange('FIXED');

        expect(wrapper.state().bombAmountFix).toBe(true);
      });

      it('must set the state prop bombAmountFix to false', () => {
        wrapper.instance().onBombAmountTypeChange('NOTFIXED');

        expect(wrapper.state().bombAmountFix).toBe(false);
      });
    });

    describe('onBoxSizeChange()', () => {
      it('must set the state prop boxSize', () => {
        wrapper.instance().onBoxSizeChange({target: {value: 66}});

        expect(wrapper.state().boxSize).toBe(66);
      });
    });

    describe('onFloodRevealTimeChange()', () => {
      it('must set the state prop floodRevealTimeOffset', () => {
        wrapper.instance().onFloodRevealTimeChange({target: {value: 77}});

        expect(wrapper.state().floodRevealTimeOffset).toBe(77);
      });
    });

    describe('onSubmit()', () => {
      const dispatchSpy = sinon.spy();

      wrapper.state().bombAmountFix = true;
      wrapper.state().bombsFixed = 3;
      const settings = {...wrapper.state(), bombAmount: 3};
      delete settings.bombsFixed;
      delete settings.bombsPercent;

      wrapper.setProps({dispatch: dispatchSpy});
      wrapper.instance().onSubmit({
        preventDefault: () => {}
      });

      it('must call dispatch with submitSettings', () => {
        expect(dispatchSpy.calledWith(submitSettings(settings))).toBeTruthy();
      });

      it('must call dispatch with resetBoard', () => {
        expect(dispatchSpy.calledWith(resetBoard())).toBeTruthy();
      });

      it('must call dispatch with toggleSettings if event arg is given', () => {
        expect(dispatchSpy.calledWith(toggleSettings())).toBeTruthy();
      });
    });
  });
});
