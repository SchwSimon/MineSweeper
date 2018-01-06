import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggleSettings, resetBoard, submitSettings } from '../actions/actions';

import '../styles/GameSettings.css';

export class GameSettings extends PureComponent {
  constructor(props) {
    super(props);

      // set the initial board dimension
      // to full screen (maximum 1920x1080)
    const width = window.innerWidth;
    const height = window.innerHeight - 138; // 120px GameHeader height + 18px margin-top
      // boxSize + 2px border
      // xMax - 1 to have some space left and right
    const xMax = Math.min(Math.floor(width / (20 + 4)), 1920) - 1;
    const yMax = Math.min(Math.floor(height / (20 + 4)), 1080-80);
    this.state = {
      dimension: {
        xMax: xMax,
        yMax: yMax
      },
      bombsPercent: 12,
      bombsFixed: 10,
      bombAmountFix: false,
      boxSize: 20,
      boxPadding: 4,
      floodRevealTimeOffset: 10
    };

    this.onXMaxChange = this.onXMaxChange.bind(this);
    this.onYMaxChange = this.onYMaxChange.bind(this);
    this.onBombAmountPercentChange = this.onBombAmountPercentChange.bind(this);
    this.onBombAmountFixedChange = this.onBombAmountFixedChange.bind(this);
    this.onBoxSizeChange = this.onBoxSizeChange.bind(this);
    this.onFloodRevealTimeChange = this.onFloodRevealTimeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
      // init a game board with the default settings
    this.onSubmit();
  }

  onXMaxChange(event) {
    const xMax = event.target.value;
    this.setState(prevState => ({
      dimension: {...prevState.dimension, xMax: xMax*1}
    }));
  }

  onYMaxChange(event) {
    const yMax = event.target.value;
    this.setState(prevState => ({
      dimension: {...prevState.dimension, yMax: yMax*1}
    }));
  }

  onBombAmountPercentChange(event) {
    this.setState({bombsPercent: event.target.value*1})
  }

  onBombAmountFixedChange(event) {
    this.setState({bombsFixed: event.target.value*1})
  }

  onBombAmountTypeChange(type) {
    this.setState({
      bombAmountFix: (type === 'FIXED') ? true : false
    });
  }

  onBoxSizeChange(event) {
    this.setState({boxSize: event.target.value*1})
  }

  onFloodRevealTimeChange(event) {
    this.setState({floodRevealTimeOffset: event.target.value*1})
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault();
      this.props.dispatch(toggleSettings());
    }

    const settings = {
      ...this.state,
      bombAmount: this.state.bombAmountFix
        ? this.state.bombsFixed
        : this.state.bombsPercent
    };

    delete settings.bombsFixed;
    delete settings.bombsPercent;


    this.props.dispatch(submitSettings(settings));
    this.props.dispatch(resetBoard());
  }

  render() {
    return (!this.props.showSettings) ? null : (
      <form className="GameSettings" onSubmit={this.onSubmit}>
        <div className="GameSettings-container">
          <label>
            <span>Horizontal boxes</span>
            <input
              type="number"
              min={1}
              value={this.state.dimension.xMax}
              onChange={this.onXMaxChange}
            />
          </label>
          <label>
            <span>Vertical boxes</span>
            <input
              type="number"
              min={1}
              value={this.state.dimension.yMax}
              onChange={this.onYMaxChange}
            />
          </label>
          <label>
            <span>Box Size</span>
            <input
              type="number"
              min={1}
              value={this.state.boxSize}
              onChange={this.onBoxSizeChange}
            />
          </label>
          <hr />
          <label
            className={this.state.bombAmountFix ? 'GameSettings-bombAmountType-active' : ''}
            onClick={() => this.onBombAmountTypeChange('PERCENT')}
          >
            <span>Bombs in %</span>
            <input
              type="number"
              min={1}
              max={100}
              value={this.state.bombsPercent}
              onChange={this.onBombAmountPercentChange}
            />
          </label>
          <label
            className={!this.state.bombAmountFix ? 'GameSettings-bombAmountType-active' : ''}
            onClick={() => this.onBombAmountTypeChange('FIXED')}
          >
            <span>Bombs fixed</span>
            <input
              type="number"
              min={1}
              value={this.state.bombsFixed}
              onChange={this.onBombAmountFixedChange}
            />
          </label>
          <hr />
          <label>
            <span>Reveal time</span>
            <input
              type="number"
              min={0}
              value={this.state.floodRevealTimeOffset}
              onChange={this.onFloodRevealTimeChange}
            />
          </label>
        </div>
        <button className="GameSettings-submit" type="submit">Submit Settings</button>
      </form>
    );
  }
}

export default connect(
  state => ({
    showSettings: state.game.showSettings
  })
)(GameSettings);
