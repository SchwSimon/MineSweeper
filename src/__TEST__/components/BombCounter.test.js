import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BombCounter } from '../../components/BombCounter';

Enzyme.configure({ adapter: new Adapter() });

describe('<BombCounter />', () => {
  const wrapper = shallow(<BombCounter />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
