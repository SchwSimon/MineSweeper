
export const spreadBombs = (xMax, yMax, bombCount) => {
    // prevent an infinite loop
  if (bombCount > xMax*yMax)
    bombCount = xMax*yMax;

    // there must be atleast 1 bomb
  if (!bombCount)
    bombCount = 1;

  const bombs = {};
  let i = 0;
  for(; i < bombCount; i++) {
    const bY = Math.floor(Math.random() * yMax);
    const bX = Math.floor(Math.random() * xMax);

    if (!bombs[bY])
      bombs[bY] = {};

      // place a bomb if this position is not yet defined
    if (!bombs[bY][bX])
      bombs[bY][bX] = true;
    else
      i--;  // we need exactly as much bombs as provided
  }

  return {
    bombs: bombs,
    bombCount: bombCount
  };
}

export const createBox = (bomb = false) => ({
  revealed: false,
  flagged: false,
  bomb: bomb,
  hint: 0
});

export const generateField = (dimension, bombAmount, isFix = false) => {
  const xMax = dimension.xMax;
  const yMax = dimension.yMax;

    // generate bombs to place in the field
    // if the bomb amount is not a fix amount
    // set the amount to X % of the field area
  const bombData = spreadBombs(
    xMax,
    yMax,
    (!isFix) ? Math.floor((xMax * yMax) * (bombAmount/100)) : bombAmount
  );
  const bombs = bombData.bombs;
  const bombCount = bombData.bombCount;

    // Generate the game field
    // spreaded with bombs
    // and hint numbers surrounding the bombs
  const field = [];
  for(let y = 0; y < yMax; y++) {
    if (field[y] === undefined) // create the field row if not existing yet
      field[y] = [];

    for(let x = 0; x < xMax; x++) {
      if (!bombs[y] || !bombs[y][x]) {  // there is no bomb at this position
        if (field[y][x] === undefined)  // position is undefined
          field[y][x] = createBox();    // define the field position as emtpy
        continue;
      }

        // set a bomb at this field position
      field[y][x] = createBox(true);

        // increment the surrounding field box hint numbers
      for(let yI = -1; yI < 2; yI++) {
        let nY = y + yI;

        if (nY < 0 || nY >= yMax) // continue if out of bound
          continue;

        if (field[nY] === undefined) // create the field row if not existing yet
          field[nY] = [];

        for(let xI = -1; xI < 2; xI++) {
          let nX = x + xI;

          if (nX < 0 || nX >= xMax) // continue if out of bound
            continue;

          if (field[nY][nX] === undefined)  // create the field box if not existing yet
            field[nY][nX] = createBox((bombs[nY] && bombs[nY][nX]) ? true : false);

          if (field[nY][nX].bomb)  // continue if its a bomb
            continue;

          field[nY][nX].hint++;  // increment the field hint number
        }
      }
    }
  }

  return {
    field: field,
    bombCount: bombCount
  }
}
