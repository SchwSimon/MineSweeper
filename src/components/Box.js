import React, { Component } from 'react';
import { connect } from 'react-redux';
import { revealBox, flagBox } from '../actions/actions';

export const HINT_COLORS = {
  0: '#000000', // default color
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#501616',
  6: '#008080',
  7: '#000000',
  8: '#666666'
};

export class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,    // box pressed state
      revealed: false   // box revealed state
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onRightClick = this.onRightClick.bind(this);
    this.reveal = this.reveal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.revealed !== this.props.revealed) {
        // reset the box to default state
      if (!nextProps.revealed)
        return this.setState({
          active: false,
          revealed: false
        });

        // return if this box already is revealed
        // this can only apply to the box which started
        // the reveal action
      if (this.state.revealed)
        return;

        // reveal the box at its own reveal time
        // specified by the box reveal index
        // multiplied by the reveal time offset
      if (nextProps.revealTimeOffset > 0)
        setTimeout(this.reveal, nextProps.revealIndex * nextProps.revealTimeOffset);
      else // true: instant reveal treats each reveal as the "initial" - reveal
        this.reveal(true);
    }
  }

    // only re-render on active, reveal or flag change
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.active !== this.state.active
      || nextState.revealed !== this.state.revealed
        || nextProps.flagged !== this.props.flagged
          || nextProps.boxSize !== this.props.boxSize)
      return true;
    return false;
  }

  onMouseEnter(event) {
      // set active if the left mouse button is clicked
      // and the box is not flagged and not revealed
    if (event.buttons === 1 && !this.props.flagged && !this.props.revealed)
      this.setState({active: true});
  }

  onMouseDown(event) {
      // return if the box is revealed
    if (this.props.revealed)
      return;

      // toggle the box flag on right mouse button down
    if (event.buttons === 2)
      this.props.dispatch(flagBox({
        x: this.props.x,
        y: this.props.y
      }));

      // set active if the left mouse button is clicked
      // and the box is not flagged
    if (event.buttons === 1 && !this.props.flagged)
      this.setState({active: true});
  }

  onMouseUp(event) {
      // return if the box is flagged or revealed
      // or the right mouse button is clicked
    if (event.button === 2 || this.props.flagged || this.props.revealed)
      return;

      // directly reveal this box
    this.reveal(true);
      // trigger box reveal
    this.onReveal();
  }

  onMouseOut() {
      // set inactive if the active state was true
      // and it was not flagged or revealed
    if (this.state.active && !this.props.flagged && !this.state.revealed)
      this.setState({active: false});
  }

  onClick() {
      // trigger box reveal if its not revealed or flagged
    if (!this.props.revealed && !this.props.flagged)
      this.onReveal();
  }

    // prevent opening the context menu
  onRightClick(event) {
    event.preventDefault();
  }

    // dispatch the box reveal action
  onReveal() {
    this.props.dispatch(revealBox({
      x: this.props.x,
      y: this.props.y
    }));
  }

    // reveal the box
    // NOTE: use this.props.revealed because of the delayed state update
    // the user can trigger a reset while the timeout is still running
    // if this is the case the box will remain unrevealed as it will be a new round
  reveal(initial) {
    this.setState({
      revealed: (initial) ? true : this.props.revealed,
      active: false
    });
  }

  render() {
    const content = (this.state.revealed)
      ? ((this.props.bomb)      // revealed
        ? 'X'                     // bomb
        : ((this.props.hint > 0)
          ? this.props.hint       // hint
          : null))                // empty
      : (this.props.flagged)    // hidden
        ? '!'                     // flag
        : null;                   // empty
    return (
      <div
        key={this.props.index}
        className={
          'MineSweeper-box' +
          ((this.state.revealed)
            ? (' revealed' + ((this.props.bomb) ? ' bomb' + ((this.props.bombTriggered) ? ' trigger' : '') : ''))
            : (this.props.flagged)
              ? ' flagged'
              : (this.state.active)
                ? ' active'
                : '')
        }
        style={{
          width: this.props.boxSize,
          height: this.props.boxSize,
          color: HINT_COLORS[(this.props.flagged) ? 0 : this.props.hint]
        }}
        onClick={this.onClick}
        onContextMenu={this.onRightClick}
        onMouseEnter={this.onMouseEnter}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOut={this.onMouseOut}
      >{content}</div>
    )
  }
}

export default connect()(Box);
