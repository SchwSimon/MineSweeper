import { spreadBombs, createBox, generateField } from '../../../reducers/game/fieldGenerator';

describe('function spreadBombs', () => {
  it('must set the bomb count to the field size', () => {
    expect(spreadBombs(5, 5, 30).bombCount).toBe(25);
  });

  it('must set the bomb count to 1', () => {
    expect(spreadBombs(5, 5, 0).bombCount).toBe(1);
    expect(spreadBombs(5, 5, -15).bombCount).toBe(1);
  });

  it('must return an object containing the correct amount of bombs placements', () => {
    const bombs = spreadBombs(5, 5, 15).bombs;

    let bombCount = 0;
    Object.keys(bombs).forEach(y => {
      bombCount += Object.keys(bombs[y]).length;
    });

    expect(bombCount).toBe(15);
  });
});

describe('function createBox', () => {
  it('must return a correct box object structure', () => {
    expect(createBox(true)).toEqual({
      revealed: false,
      flagged: false,
      bomb: true,
      hint: 0
    });

    expect(createBox(false)).toMatchObject({
      bomb: false,
    });
  });
});

describe('function generateField', () => {
  const dimension = {
    xMax: 5,
    yMax: 7
  };

  it('must return the correct amount of bombs', () => {
    expect(generateField(dimension, 25, false).bombCount).toBe(8);
    expect(generateField(dimension, 25, true).bombCount).toBe(25);
  });

  it('must create the correct field size', () => {
    const field = generateField(dimension, 30).field;
    const yKeys = Object.keys(field);

    let xLens = 0;
    yKeys.forEach(y => xLens += field[y].length);

    expect(yKeys.length).toBe(7);
    expect(xLens).toBe(5 * 7);
  });

  it('must place the correct amount of bombs in the field', () => {
    const field = generateField(dimension, 9, true).field;

    let bombsPlaced = 0;
    Object.keys(field).forEach(y => {
      Object.keys(field[y]).forEach(x => {
        if (field[y][x].bomb)
          bombsPlaced++
      })
    });

    expect(bombsPlaced).toBe(9);
  });
});
