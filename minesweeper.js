class App {
    constructor() {
        console.log("hello")
        this.width = 10
        this.height = 8
        this.board = new Board(this.width, this.height);
        this.boardElement = document.getElementById('board')
        this.isBombed = false
    }

    init() {
        // TODO: 最初の一個は爆発しない
        console.log(this.board.matrix.dumpInternal(true))
        this.render()
    }

    render() {
        // clear
        this.boardElement.innerHTML = ''

        // rendering!
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.height; x++) {
                const b = document.createElement('button')
                b.addEventListener('click', () => {
                    console.log(`Opening: x=${x} y=${y}`)
                    if (this.board.hasBomb(x, y)) {
                        // TODO: かおをかえる
                        alert("bomb!")
                        this.isBombed = true
                        this.render()
                    } else {
                        this.board.openCell(x, y)
                    }
                    this.render()
                });
                b.innerText = this.board.getCellText(x, y, this.isBombed)
                this.boardElement.append(b)
            }
            const br = document.createElement('br')
            this.boardElement.append(br)
        }
    }
}

class Board {
    width;
    height;
    matrix;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.matrix = new Matrix(width, height, () => new Cell(0.1));
    }

    hasBomb(x, y) {
        return this.matrix.hasBomb(x, y)
    }

    openCell(x, y) {
        this.matrix.openCell(x, y)
    }

    getCellText(x, y, forceOpened) {
        return this.matrix.getCell(x, y).getText(forceOpened)
    }
}

class Cell {
    hasBomb;
    isOpened;

    constructor(bombRate) {
        if (typeof bombRate === 'undefined') {
            throw 'bonbRate is required.'
        }
        this.hasBomb = Math.random() <= bombRate
        this.isOpened = false
    }

    getText(forceOpened) {
        if (forceOpened || this.isOpened) {
            if (this.hasBomb) {
                return '*'
            } else {
                // TODO: 爆弾が周囲にあるセルには数字を出す
                return '_'
            }
        } else {
            return 'X'
        }
    }
}

class Matrix {
    width;
    height;

    constructor(width, height, initializer) {
        this.width = width;
        this.height = height;

        this.cells = new Array(this.height)
        for (let y=0; y<this.height; y++) {
            this.cells[y] = new Array(this.height);
            for (let x=0; x<this.width; x++) {
                this.cells[y][x] = initializer(this);
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

    dumpInternal(forceOpened) {
        let buf = ''
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                buf += this.cells[y][x].getText(forceOpened) + ' '
            }
            buf += "\n"
        }
        return buf
    }

    openCell(x, y) {
        const target = this.getCell(x, y)
        target.isOpened = true

        // TODO: まわりがオープンされているセルを、open 状態にする。
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
