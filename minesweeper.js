class App {
    constructor() {
        console.log("hello")
        this.width = 8
        this.height = 6
        this.board = new Board(this.width, this.height);
        this.boardElement = document.getElementById('board')
        this.isBombed = false
        this.firstClicked = false
    }

    init() {
        console.log(this.board.matrix.dumpInternal(true))
        this.render()
    }

    render() {
        // clear
        this.boardElement.innerHTML = ''

        // rendering!
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                const b = document.createElement('button')
                b.addEventListener('click', () => {
                    console.log(`Opening: x=${x} y=${y}`)

                    if (!this.firstClicked) {
                        this.board.clearBomb(x, y)
                        this.board.firstOpen()
                    }

                    if (this.board.hasBomb(x, y)) {
                        // TODO: かおをかえる
                        alert("bomb!")
                        this.isBombed = true
                        this.render()
                    } else {
                        this.board.openCell(x, y)
                    }
                    this.render()

                    if (this.board.isCleared()) {
                        setTimeout(() => { alert("congrats!") }, 100);
                    }

                    this.firstClicked = true
                });

                b.addEventListener('contextmenu', e => {
                    e.preventDefault()
                    this.board.flag(x, y)
                    this.render()
                })

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

    clearBomb(x, y) {
        this.matrix.clearBomb(x, y)
    }

    firstOpen() {
        this.matrix.firstOpen()
    }

    flag(x, y) {
        this.matrix.flag(x, y)
    }

    isCleared() {
        return this.matrix.isCleared()
    }
}

class Cell {
    hasBomb;
    isOpened;
    aroundBombCount;
    flagged;

    constructor(bombRate) {
        if (typeof bombRate === 'undefined') {
            throw 'bonbRate is required.'
        }
        this.hasBomb = Math.random() <= bombRate
        this.isOpened = false
        this.aroundBombCount = undefined
        this.flagged = false
    }

    setAroundBombCount(n) {
        this.aroundBombCount = n
    }

    getText(forceOpened) {
        if (forceOpened || this.isOpened) {
            if (this.hasBomb) {
                return '*'
            } else if (typeof this.aroundBombCount !== 'undefined') {
                return this.aroundBombCount
            } else {
                return '_'
            }
        } else {
            if (this.flagged) {
                return 'P'
            } else {
                return 'X'
            }
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
        if (x<0) {
            throw 'x should be positive'
        }
        if (y<0) {
            throw 'y should be positive'
        }
        if (y >= this.height) {
            throw 'y is greater than height'
        }
        // console.log(`getCell x=${x} y=${y}`)
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

        const targetStat = this.getCellStat(x, y)
        if (targetStat.bombCount === 0){
            this.walk(x, y, (x, y) => {
                const cell = this.getCell(x, y)

                if (!cell.hasBomb && !cell.isOpened) {
                    this.openCell(x, y)
                }
            })
        }
    }

    // 最初にセルがオープンされたことにより、爆弾の位置が確定される。
    // 周囲の爆弾の数を決定してセルに書き込む
    firstOpen() {
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                const cell = this.getCell(x, y)
                if (cell.isOpened || cell.hasBomb) {
                    continue;
                }

                const stat = this.getCellStat(x, y)
                if (stat.bombCount>0) {
                    cell.setAroundBombCount(stat.bombCount)
                }
            }
        }
    }

    getCellStat(x, y) {
        let bombCount = 0
        let openedCount = 0
        this.walk(x, y, (x, y) => {
            const cell = this.getCell(x, y)
            bombCount += cell.hasBomb
            openedCount += cell.isOpened
        });
        return {
            openedCount,
            bombCount
        }
    }

    walk(x, y, callback) {
        [-1, 0, 1].forEach(yy => {
            [-1, 0, 1].forEach(xx => {
                if (xx== 0 && yy==0) {
                    return;
                }
                if (this.isValidCell(x+xx, y+yy)) {
                    callback(x+xx, y+yy)
                }
            })
        })
    }

    clearBomb(x, y) {
        const cell = this.getCell(x, y)
        cell.hasBomb = false
    }

    isValidCell(x, y) {
        return x>=0 && y>=0 && x<this.width && y<this.height
    }

    flag(x, y) {
        const cell = this.getCell(x, y)
        if (!cell.isOpened) {
            cell.flagged = !cell.flagged
        }
    }

    isCleared() {
        // 勝利条件。bomb を除く全てのますが opened 状態になる
        for (let y=0; y<this.height; y++) {
            for (let x=0; x<this.width; x++) {
                const cell = this.getCell(x, y)
                if (cell.isOpened || cell.hasBomb) {
                    continue;
                }

                return false;
            }
        }
        return true;
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
