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

    open(x, y) {
        if (this.matrix.hasBomb(x, y)) {
            // TODO: かおをかえる
            alert("bomb!")
        } else {
            this.matrix.openCell(x, y)
        }
    }
}

class Cell {
    hasBomb;
    isOpened;

    constructor(bombRate) {
        this.hasBomb = Math.random() > bombRate
        this.isOpened = false
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

    hasBomb(x, y) {
        return this.getCell(x, y).hasBomb
    }

    getCell(x, y) {
        if (x>=this.width) {
            throw 'x is greater than width'

         }
        if (y >= this.height) {
            throw 'y is greater than height'
        }
        return this.cells[y][x]
    }

    openCell(x, y) {
        const target = this.getCell(x, y)
        target.hasBomb = true

        // TODO: まわりがオープンされているセルを、open 状態にする。
        // TODO: 周囲セルに数字を出す
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
