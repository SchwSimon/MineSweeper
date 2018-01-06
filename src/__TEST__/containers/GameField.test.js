import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GameField } from '../../containers/GameField';

Enzyme.configure({ adapter: new Adapter() });

describe('<GameField />', () => {
  const wrapper = shallow(<GameField />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
