import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Board } from '../../components/Board';

Enzyme.configure({ adapter: new Adapter() });

describe('<Board />', () => {
  const wrapper = shallow(<Board />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
