
  // NOTE: this is a mutating function!
  // the input object 'field' gets mutated
export const triggerBombs = (field) => {
  const maxY = field.length;
  const maxX = field[0].length;

  for(let y = 0; y < maxY; y++) {
    for(let x = 0; x < maxX; x++) {

        // reveal the bomb
      if (field[y][x].bomb)
        field[y][x].revealed = true;
    }
  }
}
