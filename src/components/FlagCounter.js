import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

export class FlagCounter extends PureComponent {
  render() {
      // display always 3 numbers by appending leading zeros
    const counter = (this.props.flagCount < 10)
      ? '00' + this.props.flagCount
      : (this.props.flagCount < 100)
        ? '0' + this.props.flagCount
        : this.props.flagCount;
    return (
      <div className="GameHeader-display">
        <div className="GameHeader-display-info">Flags</div>
        <div className="GameHeader-display-sprite">!</div>
        <span>{counter}</span>
      </div>
    )
  }
}

export default connect(
  state => ({
    flagCount: state.game.flagCount
  })
)(FlagCounter);
