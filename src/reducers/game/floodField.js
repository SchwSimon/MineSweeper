
  // NOTE: this is a mutating function!
  // // the input object 'field' gets mutated
  // NOTE: the flood sequence does NOT include the initial
  // // outgoing position !
export const floodField = (field, y, x, floodSequence = []) => {
  for(let yI = -1; yI < 2; yI++) {
    let nY = yI + y;

      // out of bound
    if (!field[nY])
      continue;

    for(let xI = -1; xI < 2; xI++) {
      let nX = xI + x;

        // continue if..
      if (field[nY][nX] === undefined // out of bound
        || field[nY][nX].flagged      // box is flagged
          || field[nY][nX].revealed)  // box is revealed
        continue;

        // reveal the box
      field[nY][nX].revealed = true;

        // remember the sequence
      floodSequence.push({
        y: nY,
        x: nX
      });

        // continue if its a hint box
      if (field[nY][nX].hint > 0)
        continue;

        // flood the next empty box
      floodSequence = floodField(field, nY, nX, floodSequence);
    }
  }

  return floodSequence;
}
