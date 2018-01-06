import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MineSweeper } from '../../containers/MineSweeper';

Enzyme.configure({ adapter: new Adapter() });

describe('<MineSweeper />', () => {
  const wrapper = shallow(<MineSweeper />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
