const buildGrid = (puzzleString) => {
  let grid = [];
  let puzzleStringCursor = 0;
  for (let i = 0; i < 9; i ++) {
    let row = [];
    for (let j = 0; j < 9; j ++) {
      row.push(puzzleString[puzzleStringCursor ++]);
    }
    grid.push(row);
  }
  return grid;
}

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    if (/[^1-9\.]/.test(puzzleString)) {
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = buildGrid(puzzleString);
    let isValid = true;
    for (let j = 0; j < 9; j ++) {
      if (
        grid[row.toUpperCase().charCodeAt(0) - 65][j] == value
        && j != column - 1
      ) {
        isValid = false;
      }
    }
    return isValid;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = buildGrid(puzzleString);
    let isValid = true;
    for (let i = 0; i < 9; i ++) {
      if (
        grid[i][column - 1] == value 
        && i != row.toUpperCase().charCodeAt(0) - 65
      ) {
        isValid = false;
      }
    }
    return isValid;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor((row.toUpperCase().charCodeAt(0) - 65) / 3);
    const regionColumn = Math.floor((column - 1) / 3);
    const rowInRegion = (row.toUpperCase().charCodeAt(0) - 65) % 3;
    const columnInRegion = (column - 1) % 3;
    let isValid = true;
    for (let k = 0; k < 81; k ++) {
      if (
        Math.floor(Math.floor(k / 9) / 3) === regionRow && Math.floor((k % 9) / 3) === regionColumn
        && puzzleString[k] == value
        && (Math.floor(k / 9) % 3 !== rowInRegion || (k % 9) % 3 !== columnInRegion)
      ) {
        isValid = false;
      }
    }
    return isValid;
  }

  solve(puzzleString) {
    const backtrack = (puzzleString, puzzleStringCursor) => {
      //console.log('puzzleString:', puzzleString, 'puzzleStringCursor:', puzzleStringCursor);
      if (puzzleStringCursor >= 81) {
        //console.log('DONE', 'puzzleString:', puzzleString);
        return puzzleString; //if we processed all the characters in the puzzleString, we return it
      }
      if (puzzleString[puzzleStringCursor] === '.') {
        const row = String.fromCharCode(Math.floor(puzzleStringCursor / 9) + 65);
        const column = (puzzleStringCursor % 9) + 1;
        for (let digit = 1; digit <= 9; digit ++) {
          if (
            this.checkRowPlacement(puzzleString, row, column, digit)
            && this.checkColPlacement(puzzleString, row, column, digit)
            && this.checkRegionPlacement(puzzleString, row, column, digit)
          ) {
            puzzleString = puzzleString.substring(0, puzzleStringCursor) + digit + puzzleString.substring(puzzleStringCursor + 1);
            const result = backtrack(puzzleString, puzzleStringCursor + 1); //we call backtrack() with the new string and advance the puzzleStringCursor
            if (result) {
              return result; //if result is not null, we return it so it can be used in future calls of the backtrack() function
            }
          }
        }
        return null; //no valid digit found, backtrack
      } else {
        return backtrack(puzzleString, puzzleStringCursor + 1); //if the current character in the string is not '.', we call backtrack() with the same puzzleString and the next position in the string
      }
    }
    if (this.validate(puzzleString)) {
      return backtrack(puzzleString, 0); //the initial call to the backtrack() function
    } else {
      return null;
    }
  }
}

module.exports = SudokuSolver;

