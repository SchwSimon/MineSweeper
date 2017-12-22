import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { resetBoard } from '../actions/actions';

import '../styles/ResetButton.css';

export const FACE = {
  SMILE: ' smile',
  ATTENTION: ' attention',
  WIN: ' win',
  LOSE: ' lose'
};

export class ResetButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      face: FACE.SMILE,
      rotateZ: 0
    };

    this.onClick = this.onClick.bind(this);
    this.setFaceAttention = this.setFaceAttention.bind(this);
    this.setFaceSmile = this.setFaceSmile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.roll();

    if (nextProps.isWin !== this.props.isWin && nextProps.isWin)
      return this.setState({face: FACE.WIN});

    if (nextProps.isLose !== this.props.isLose && nextProps.isLose)
      return this.setState({face: FACE.LOSE});

    this.setState({face: FACE.SMILE});
  }

  componentWillMount() {
    window.addEventListener('mousedown', this.setFaceAttention, false);
    window.addEventListener('mouseup', this.setFaceSmile, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.setFaceAttention, false);
    window.removeEventListener('mouseup', this.setFaceSmile, false);
  }

  setFaceAttention() {
    if (!this.props.isWin && !this.props.isLose)
      this.setState({face: FACE.ATTENTION});
  }

  setFaceSmile() {
    if (!this.props.isWin && !this.props.isLose)
      this.setState({face: FACE.SMILE});
  }

  roll() {
    this.setState(prevState => ({
      rotateZ: (prevState.rotateZ || 0) + 360
    }));
  }

  onClick() {
    this.props.dispatch(resetBoard());
  }

  render() {
    return (
      <div
        className="ResetButton"
        style={{
          transform: 'rotateZ(' + this.state.rotateZ + 'deg)'
        }}
      >
        <div className={"ResetButton-mouth" + this.state.face}></div>
        <div className={"ResetButton-eyeLeft" + this.state.face}></div>
        <div className={"ResetButton-eyeRight" + this.state.face}></div>
        {this.props.isWin &&
          <div>
            <div className="ResetButton-glass-left"></div>
            <div className="ResetButton-glass-right"></div>
          </div>
        }
        <div
          className="ResetButton-trigger"
          onClick={this.onClick}
        />
      </div>
    );
  }
}

export default connect(
	state => ({
    isWin: state.game.isWin,
    isLose: state.game.isLose
	})
)(ResetButton);
