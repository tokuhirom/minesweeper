const minesweeper = require('./minesweeper')
const assert = require('assert');

describe('Matrix', function() {
  it('has expected size', () => {
    const b = new minesweeper.Matrix(10, 8, () => 0)
    assert(b.width === 10)
    assert(b.height === 8)
  })
  it('get edge node', () => {
    const b = new minesweeper.Matrix(10, 8, () => new minesweeper.Cell(0.9))
    console.log(b.getCell(0,0) instanceof minesweeper.Cell)
    assert( b.getCell(0, 0) instanceof minesweeper.Cell)
    assert( b.getCell(9, 7) instanceof minesweeper.Cell)
  })
});
