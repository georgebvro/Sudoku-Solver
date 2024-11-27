'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({ error: 'Required field(s) missing' });
      } else if (/[^1-9\.]/.test(req.body.puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
      } else if (req.body.puzzle.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      } else if (!/^[a-iA-I][1-9]$/.test(req.body.coordinate)) {
        res.json({ error: 'Invalid coordinate' });
      } else if (!/^[1-9]$/.test(req.body.value)) {
        res.json({ error: 'Invalid value' });
      } else {
        const validOnRow = solver.checkRowPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);
        const validOnColumn = solver.checkColPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);
        const validOnRegion = solver.checkRegionPlacement(req.body.puzzle, req.body.coordinate[0], req.body.coordinate[1], req.body.value);
        let conflictCriteria = [];
        if (!validOnRow) {
          conflictCriteria.push('row');
        }
        if (!validOnColumn) {
          conflictCriteria.push('column');
        }
        if (!validOnRegion) {
          conflictCriteria.push('region');
        }
        //console.log('validOnRow:', validOnRow, 'validOnColumn:', validOnColumn, 'validOnRegion:', validOnRegion, '=> conflictCriteria:', conflictCriteria);
        if (validOnRow && validOnColumn && validOnRegion) {
          res.json({ valid: true });
        } else {
          res.json({ valid: false, conflict: conflictCriteria });
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        res.json({ error: 'Required field missing' });
      } else if (/[^\d|\.]/.test(req.body.puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
      } else if (req.body.puzzle.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      } else {
        const solution = solver.solve(req.body.puzzle);
        if (solution) {
          res.json({ solution: solution });
        } else {
          res.json({ error: 'Puzzle cannot be solved' });
        }
      }
    });
};
