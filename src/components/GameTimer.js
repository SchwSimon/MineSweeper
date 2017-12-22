import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setTimeTick } from '../actions/actions';

export class GameTimer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      timer: null
    };

    this.tick = this.tick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.paused !== this.props.paused)
      return (!nextProps.paused)
        ? this.startTimer()
        : this.stopTimer();
  }

  startTimer() {
    this.setState({
      timer: setTimeout(this.tick, 1000)
    });
  }

  stopTimer() {
    this.setState(prevState => {
      clearTimeout(prevState.timer);

      return {
        timer: null
      };
    });
  }

  tick() {
    if (!this.state.timer)
      return;

      // update the time ticker
    this.props.dispatch(setTimeTick());

      // stop the time if the maximum time of 999 seconds is reached
    if (this.state.time === 999)
      return this.stopTimer();

      // set the next timeout
    this.setState({
      timer: setTimeout(this.tick, 1000)
    });
  }

  render() {
      // always display 3 numbers by appending leading zeros
    const time = (this.props.time < 10)
      ? '00' + this.props.time
      : (this.props.time < 100)
        ? '0' + this.props.time
        : this.props.time;
    return (
      <div className="GameHeader-display">
        <div className="GameHeader-display-info">Time</div>
        <div
          className="GameHeader-display-sprite"
          style={{
            fontSize: 36,
            lineHeight: 1.4,
            letterSpacing: -2
          }}
        ><span role="img" aria-label="game time">&#8987;</span></div>
        <span>{time}</span>
      </div>
    )
  }
}

export default connect(
  state => ({
    paused: state.game.pauseTimer,
    time: state.game.time
  })
)(GameTimer);
