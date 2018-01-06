import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { FlagCounter } from '../../components/FlagCounter';

Enzyme.configure({ adapter: new Adapter() });

describe('<FlagCounter />', () => {
  const wrapper = shallow(<FlagCounter />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
