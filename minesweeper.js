class App {
    init() {
        console.log("hello")
        this.board = new Board(10, 8);
    }
}

class Board {
    width;
    height;
    matrix;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.matrix = new Matrix(() => new Cell());
    }

    init() {

    }
}

class Cell {
    hasBomb;

    constructor(bombRate) {
        this.hasBomb = Math.random() > bombRate
    }
}

class Matrix {
    width;
    height;

    constructor(width, height, initializer) {
        this.width = width;
        this.height = height;

        this.cells = new Array(this.height)
        for (let y=0; y<this.width; y++) {
            this.cells[y] = new Array(this.height);
            for (let x=0; x<this.width; x++) {
                this.cells[y][x] = initializer();
            }
        }
    }

    getCell(x, y) {
        return this.cells[y][x]
    }
}

if (typeof module === 'undefined') {
    // for browser
    const app = new App()
    app.init()
} else {
    // for testing
    module.exports = {
        Board,
        Cell,
        Matrix
    }
}
