import { floodField } from '../../../reducers/game/floodField';
import { generateField } from '../../../reducers/game/fieldGenerator';

describe('function floodField', () => {
  const xMax = 10;
  const yMax = 10;
  const forEachBoxInField = (field, callback) => {
    for(let y = 0; y < yMax; y++) {
      for(let x = 0; x < xMax; x++) {
        callback(field[y][x]);
      }
    }
  };

  it('must reveal the complete field', () => {
    const field = generateField({yMax: yMax, xMax: xMax}, 1, true).field;

    forEachBoxInField(field, box => {
      box.bomb = false;
      box.hint = 0;
    });

    floodField(field, 1, 1);

    let revealedFields = 0;
    forEachBoxInField(field, box => {
      if (box.revealed)
        revealedFields++;
    });

    expect(revealedFields).toBe(xMax * yMax);
  });
});
