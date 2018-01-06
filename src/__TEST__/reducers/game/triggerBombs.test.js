import { triggerBombs } from '../../../reducers/game/triggerBombs';
import { generateField } from '../../../reducers/game/fieldGenerator';

describe('function triggerBombs', () => {
  it('must reveal all field containing bombs', () => {
    const board = generateField({xMax: 20, yMax: 20}, 25, true).field;

    triggerBombs(board);

    let revealedBombs = 0;
    [...board].forEach(y => [...y].forEach(x => {
      if (x.bomb && x.revealed)
        revealedBombs++;
    }))

    expect(revealedBombs).toBe(25);
  });
});
