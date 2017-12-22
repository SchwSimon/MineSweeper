import React, { PureComponent } from 'react';
import FlagCounter from '../components/FlagCounter';
import BombCounter from '../components/BombCounter';
import GameTimer from '../components/GameTimer';
import ResetButton from '../components/ResetButton';
import SettingsButton from '../components/SettingsButton';
import GameSettings from '../components/GameSettings';

import '../styles/GameHeader.css';

export class GameHeader extends PureComponent {
  render() {
    return (
      <div className="GameHeader">
        <div className="GameHeader-holder">
          <FlagCounter />
          <BombCounter />
          <ResetButton />
          <GameTimer />
          <SettingsButton />
          <GameSettings />
        </div>
      </div>
    );
  }
}

export default GameHeader;
