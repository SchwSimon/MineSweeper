import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { GameHeader } from '../../containers/GameHeader';

Enzyme.configure({ adapter: new Adapter() });

describe('<GameHeader />', () => {
  const wrapper = shallow(<GameHeader />);

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });
});
