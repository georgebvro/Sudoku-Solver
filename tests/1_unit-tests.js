const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    expect(
      solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 
      'Failure handling a valid puzzle string of 81 characters.')
    .to.equal(true);
    
    expect(
      solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 
      'Failure handling a valid puzzle string of 81 characters.')
    .to.be.a('Boolean');
    
    assert.equal(
      solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), true, 
      'Failure handling a valid puzzle string of 81 characters.'
    );
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    expect(
      solver.validate('!?0..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 
      'Failure handling a puzzle string with invalid characters (not 1-9 or .).'
    )
    .to.equal(false);

    assert.equal(
      solver.validate('!?0..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), false,
      'Failure handling a puzzle string with invalid characters (not 1-9 or .).'
    );
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const solution = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37');
    expect(
      solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'),
       'Failure handling a puzzle string that is not 81 characters in length.'
      )
    .to.equal(false);

    assert.equal(
      solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'), false,
      'Failure handling a puzzle string that is not 81 characters in length.'
    );
  });

  test('Logic handles a valid row placement', () => {
    expect(
      solver.checkRowPlacement('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 'A', '2', '4'), 
      'Failure handling a valid row placement.'
    )
    .to.equal(true);

    assert.equal(
      solver.checkRowPlacement('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 'A', '2', '4'), true,
      'Failure handling a valid row placement.'
    );
  });

  test('Logic handles an invalid row placement', () => {
    expect(
      solver.checkRowPlacement('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 'B', '3', '9'),
      'Failure handling an invalid row placement.'
    )
    .to.equal(false);

    assert.equal(
      solver.checkRowPlacement('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3', 'B', '3', '9'), false,
      'Failure handling an invalid row placement.'
    );
  });

  test('Logic handles a valid column placement', () => {
    expect(
      solver.checkColPlacement('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 'C', '5', '1'),
      'Failure handling a valid column placement.'
    )
    .to.equal(true);

    assert.equal(
      solver.checkColPlacement('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 'C', '5', '1'), true,
      'Failure handling a valid column placement.'
    );
  });

  test('Logic handles an invalid column placement', () => {
    expect(
      solver.checkColPlacement('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 'D', '1', '6'),
      'Failure handling an invalid column placement.'
    )
    .to.equal(false);

    assert.equal(
      solver.checkColPlacement('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1', 'D', '1', '6'), false,
      'Failure handling an invalid column placement.'
    );
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    expect(
      solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6', 'E', '6', '2'),
      'Failure handling a valid region (3x3 grid) placement.'
    )
    .to.equal(true);

    assert.equal(
      solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6', 'E', '6', '2'), true,
      'Failure handling a valid region (3x3 grid) placement.'
    );
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    expect(
      solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6', 'F', '4', '5'),
      'Failure handling an invalid region (3x3 grid) placement.'
    )
    .to.equal(false);

    assert.equal(
      solver.checkRegionPlacement('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6', 'F', '4', '5'), false,
      'Failure handling an invalid region (3x3 grid) placement.'
    );
  });

  test('Valid puzzle strings pass the solver', () => {
    expect(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
      'Failure passing the solver with a valid puzzle string.'
    )
    .to.not.equal(null);

    assert.notEqual(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'), null,
      'Failure passing the solver with a valid puzzle string.'
    );
  });

  test('Invalid puzzle strings fail the solver', () => {
    expect(
      solver.solve('82..4..6...16..89...98315.749.157....XyZaBc...53..4...96.415..81..7632..3...28.51'),
      'Failure failing the solver with an invalid puzzle string.'
    )
    .to.equal(null);

    assert.equal(
      solver.solve('82..4..6...16..89...98315.749.157....XyZaBc...53..4...96.415..81..7632..3...28.51'), null,
      'Failure failing the solver with an invalid puzzle string.'
    )
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    expect(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
      'Failure returning the expected solution for an incomplete puzzle.'
    )
    .to.equal('827549163531672894649831527496157382218396475753284916962415738185763249374928651');

    expect(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
      'Failure returning the expected solution for an incomplete puzzle (returned not a String).'
    )
    .to.be.a('String');

    expect(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
      'Failure returning the expected solution for an incomplete puzzle (wrong string length).'
    )
    .to.have.a.lengthOf(81);

    assert.equal(
      solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
      '827549163531672894649831527496157382218396475753284916962415738185763249374928651',
      'Failure returning the expected solution for an incomplete puzzle.'
    )
  });
});
