import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Box from './Box';

export class Board extends PureComponent {
    // only render if the dimensions are set
  render() {
    return (!this.props.dimension) ? null : (
      <div
        className="MineSweeper-field"
        style={{
          fontSize: this.props.boxSize,
          width: (this.props.boxSize + this.props.boxPadding) * this.props.dimension.xMax
        }}
      >
        {this.props.board && this.props.board.map((row, Y) => (
          <div key={Y}>
            {row.map((col, X) => (
              <Box
                key={X}
                boxSize={this.props.boxSize}
                hint={col.hint}
                revealed={col.revealed || this.props.isWin}
                revealIndex={this.props.floodSequence.findIndex(n => (n.y === Y && n.x === X))}
                revealTimeOffset={this.props.floodRevealTimeOffset}
                flagged={col.flagged}
                bomb={col.bomb}
                bombTriggered={this.props.triggeredBomb.y === Y && this.props.triggeredBomb.x === X}
                y={Y}
                x={X}
              />
            ))}
          </div>
        ))}
        {
          (this.props.isWin || this.props.isLose)
          ? <div
              className="MineSweeper-field-blockactions"
              onContextMenu={event => event.preventDefault()}
            >
              {this.props.isWin && <span className="MineSweeper-field-endtitle win">W I N</span>}
              {this.props.isLose && <span className="MineSweeper-field-endtitle lose">L O S E</span>}
            </div>
          : null
        }
      </div>
    )
  }
}

export default connect(
  state => ({
    board: state.game.board,
    triggeredBomb: state.game.triggeredBomb,
    floodSequence: state.game.floodSequence,
    floodRevealTimeOffset: state.game.floodRevealTimeOffset,
    dimension: state.game.dimension,
    boxSize: state.game.boxSize,
    boxPadding: state.game.boxPadding,
    isWin: state.game.isWin,
    isLose: state.game.isLose
  })
)(Board);
