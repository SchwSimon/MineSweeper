import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

export class BombCounter extends PureComponent {
  render() {
      // display always 3 numbers by appending leading zeros
    const counter = (this.props.bombCount < 10)
      ? '00' + this.props.bombCount
      : (this.props.bombCount < 100)
        ? '0' + this.props.bombCount
        : this.props.bombCount;
    return (
      <div className="GameHeader-display">
        <div className="GameHeader-display-info">Bombs</div>
        <div
          className="GameHeader-display-sprite"
          style={{
            fontSize: 36,
            lineHeight: 1.4,
            letterSpacing: -2
          }}
        >X</div>
        <span>{counter}</span>
      </div>
    )
  }
}

export default connect(
  state => ({
    bombCount: state.game.bombCount
  })
)(BombCounter);
