import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggleSettings } from '../actions/actions';

import '../styles/SettingsButton.css';

export class ResetButton extends PureComponent {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.dispatch(toggleSettings());
  }

  render() {
    return (
      <div
        className="SettingsButton"
        onClick={this.onClick}
      >?</div>
    );
  }
}

export default connect()(ResetButton);
