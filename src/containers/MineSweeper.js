import React, { PureComponent } from 'react';
import GameHeader from './GameHeader';
import GameField from './GameField';

import '../styles/MineSweeper.css';

export class MineSweeper extends PureComponent {
  render() {
    return (
      <div className="MineSweeper">
        <GameHeader />
        <GameField />
      </div>
    );
  }
}

export default MineSweeper;
