const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { validateBoolOption } = require("@babel/preset-env/lib/normalize-options");
const { test } = require("mocha");

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai.request(server)
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure solving a puzzle with a valid puzzle string (wrong response status).');
      assert.typeOf(res.body.solution, 'string', 'Failure solving a puzzle with a valid puzzle string (returned not a String).');
      assert.lengthOf(res.body.solution, 81, 'Failure solving a puzzle with a valid puzzle string (solution doesn\'t have 81 characters).');
      assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378', 'Failure solving a puzzle with a valid puzzle string (wrong solution).');
      done();
    });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai.request(server)
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({ })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure solving a puzzle with missing puzzle string (wrong response status).');
      assert.equal(res.body.error, 'Required field missing', 'Failure solving a puzzle with missing puzzle string (wrong error response).');
      done();
    });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai.request(server)
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({ puzzle: 'A0*..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure solving a puzzle with invalid characters (wrong response status).');
      assert.equal(res.body.error, 'Invalid characters in puzzle', 'Failure solving a puzzle with invalid characters (wrong error response).');
      done();
    });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai.request(server)
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1' })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure solving a puzzle with incorrect length (wrong response status).');
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Failure solving a puzzle with incorrect length (wrong error response).');
      done();
    });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
    chai.request(server)
    .post('/api/solve')
    .set('content-type', 'application/json')
    .send({ puzzle: '11.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure solving a puzzle that cannot be solved (wrong response status).');
      assert.equal(res.body.error, 'Puzzle cannot be solved', 'Failure solving a puzzle that cannot be solved (wrong error response).');
      done();
    });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({ 
      puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
      coordinate: 'I8',
      value: '9'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with all fields (wrong response status).');
      assert.equal(res.body.valid, true, 'Failure checking a puzzle placement with all fields (wrong response value).');
      assert.notExists(res.body.conflict, 'Failure checking a puzzle placement with all fields (conflict property exists).');
    });
    done();
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
      coordinate: 'H9',
      value: '3'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with a single placement conflict (wrong response status).');
      assert.equal(res.body.valid, false, 'Failure checking a puzzle placement with a single placement conflict (wrong response value).');
      assert.typeOf(res.body.conflict, 'array', 'Failure checking a puzzle placement with a single placement conflict (wrong conflict property type).');
      assert.lengthOf(res.body.conflict, 1, 'Failure checking a puzzle placement with a single placement conflict (wrong conflict property length).');
      assert.equal(res.body.conflict[0], 'row', 'Failure checking a puzzle placement with a single placement conflict (wrong conflict property value).');
      done();
    });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
      coordinate: 'G3',
      value: '8'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with multiple placement conflicts (wrong response status).');
      assert.equal(res.body.valid, false, 'Failure checking a puzzle placement with multiple placement conflicts (wrong response value).');
      assert.lengthOf(res.body.conflict, 2, 'Failure checking a puzzle placement with multiple placement conflicts (wrong conflict property length).');
      assert.equal(res.body.conflict[0], 'row', 'Failure checking a puzzle placement with multiple placement conflicts (wrong conflict property value).');
      assert.equal(res.body.conflict[1], 'column', 'Failure checking a puzzle placement with multiple placement conflicts (wrong conflict property value).');
      done();
    });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
      coordinate: 'C1',
      value: '1'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with all placement conflicts (wrong response status).');
      assert.equal(res.body.valid, false, 'Failure checking a puzzle placement with all placement conflicts (wrong response value');
      assert.lengthOf(res.body.conflict, 3, 'Failure checking a puzzle placement with all placement conflicts (wrong conflict property length).');
      assert.equal(JSON.stringify(res.body.conflict), '["row","column","region"]', 'Failure checking a puzzle placement with all placement conflicts (wrong conflict property value).');
      assert.equal(JSON.stringify(res.body), '{"valid":false,"conflict":["row","column","region"]}', 'Failure checking a puzzle placement with all placement conflicts (wrong response value).');
      done();
    });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      coordinate: 'D6',
      value: '9'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with missing required fields (wrong response status).');
      assert.equal(res.body.error, 'Required field(s) missing', 'Failure checking a puzzle placement with missing required fields (wrong error response).');
      done();
    });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '82..4..6...16..89...98315.749.157....xYz*(....53..4...96.415..81..7632..3...28.51',
      coordinate: 'E7',
      value: '2'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with invalid characters in puzzle (wrong response status).');
      assert.equal(res.body.error, 'Invalid characters in puzzle', 'Failure checking a puzzle placement with invalid characters in puzzle (wrong error response).');
      done();
    });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.5',
      coordinate: 'F3',
      value: '3'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with incorrect length (wrong response status).');
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Failure checking a puzzle placement with incorrect length (wrong error response).');
      done();
    });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
      coordinate: 'J9',
      value: '9'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with invalid placement coordinate (wrong response status).');
      assert.equal(res.body.error, 'Invalid coordinate', 'Failure checking a puzzle placement with invalid placement coordinate (wrong error response).');
      done();
    });
  });

  test('Check a puzzle placement with invalid placement value', done => {
    chai.request(server)
    .post('/api/check')
    .set('content-type', 'application/json')
    .send({
      puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
      coordinate: 'G8',
      value: '0'
    })
    .end((err, res) => {
      assert.equal(res.status, 200, 'Failure checking a puzzle placement with invalid placement value (wrong response status).');
      assert.equal(res.body.error, 'Invalid value', 'Failure checking a puzzle placement with invalid placement value (wrong error response).');
      done();
    });
  });
});

