const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const difficulty = document.getElementById("difficulty");
const button = document.getElementById("button");

/* 
Easy: 8x8 with 10 mines
Medium: 16x16 with 40 mines
Hard: 30x16 with 99 mines
*/

let rows = 8;
let columns = 8;
let mines = 10;

let mineWidth = 40;
let mineHeight = 40;

canvas.width = mineWidth*columns;
canvas.height = mineHeight*rows;
let width = canvas.width;
let height = canvas.height;

let grid = [];

let numberOfMines = 0;

let highlightedGrid;

let firstAttempt = true;

let lostGame = false;

const init = () => {
    canvas.width = mineWidth*columns;
    canvas.height = mineHeight*rows;
    grid = [];
    numberOfMines = 0;
    highlightedGrid = "";
    firstAttempt = true;
    lostGame = false;

    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < columns; j++) {
            grid[i].push(new Block(i, j));
        }
    }

    for (let i = 0; i < mines; i++) {
        let randY = random(0, grid.length-1);
        let randX = random(0, grid[0].length-1);

        while (grid[randY][randX].containsMine) {
            randY = random(0, grid.length-1);
            randX = random(0, grid[0].length-1);
        }

        grid[randY][randX].containsMine = true;
    }

    draw();
}

const checkMines = () => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (i+k >= 0 && i+k < grid.length && j+l >= 0 && j+l < grid[0].length && !(k == 0 && l == 0)) {
                        if (grid[i+k][j+l].containsMine) {
                            grid[i][j].minesAround++;
                        }
                    }
                }
            }
        }
    }
}

button.onclick = function() {
    if (difficulty.value == "Easy") {
        rows = 8;
        columns = 8;
        mines = 10;
        mineWidth = 40;
        mineHeight = 40;
    } else if (difficulty.value == "Medium") {
        rows = 16;
        columns = 16;
        mines = 40;
        mineWidth = 35;
        mineHeight = 35;
    } else if (difficulty.value == "Hard") {
        rows = 16;
        columns = 30;
        mines = 99;
        mineWidth = 35;
        mineHeight = 35;
    } else if (difficulty.value == "Custom") {
        rows = parseInt(prompt("How many rows would you like? (5-40)"));

        while (!Number.isInteger(rows) || rows <= 4 || rows > 40) {
            rows = parseInt(prompt("How many rows would you like? (5-40)"));
        }

        columns = parseInt(prompt("How many columns would you like? (5-40)"));

        while (!Number.isInteger(columns) || columns <= 4 || columns > 40) {
            columns = parseInt(prompt("How many columns would you like? (5-40)"));
        }

        mines = parseInt(prompt(`How many mines would you like (1-${rows*columns/2})`));

        while (!Number.isInteger(mines) || mines <= 0 || mines >= rows*columns) {
            mines = parseInt(prompt(`How many mines would you like (1-${rows*columns/2})`));
        }

        mineWidth = 800/columns;
        mineHeight = mineWidth;
    }

    init();
};

init();

canvas.addEventListener("click", function(mouse) {
    if (!lostGame) {
        let mouseX = mouse.offsetX;
        let mouseY = mouse.offsetY;

        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        if (!grid[mouseRow][mouseColumn].flagged) {
            if (grid[mouseRow][mouseColumn].containsMine) {
                if (!firstAttempt) {
                    alert("You Lose!");

                    lostGame = true;
                } else {
                    let newRow = 0;
                    let newColumn = 0;

                    while (grid[newRow][newColumn].containsMine) {
                        newColumn++;

                        if (newColumn >= grid[0].length) {
                            newRow++;
                            newColumn = 0;
                        }
                    }

                    grid[newRow][newColumn].containsMine = true;
                    grid[mouseRow][mouseColumn].containsMine = false;
                }
            }

            if (firstAttempt) {
                firstAttempt = false;

                for (let i = mouseRow-1; i <= mouseRow+1; i++) {
                    for (let j = mouseColumn-1; j <= mouseColumn+1; j++) {
                        if (i in grid && j in grid[0] && grid[i][j].containsMine) {
                            grid[i][j].containsMine = false;

                            let newX1 = random(0, mouseColumn-2);
                            let newX2 = random(mouseColumn+2, grid[0].length-1);
                            let newY1 = random(0, mouseRow-2);
                            let newY2 = random(mouseRow+2, grid.length-1);

                            if (newY1 in grid) {
                                if (newX1 in grid[0]) {
                                    if (grid[newY1][newX1].containsMine) {
                                        j--;
                                    }

                                    grid[newY1][newX1].containsMine = true;
                                } else {
                                    if (grid[newY1][newX2].containsMine) {
                                        j--;
                                    }

                                    grid[newY1][newX2].containsMine = true;
                                }
                            } else {
                                if (newX1 in grid[0]) {
                                    if (grid[newY2][newX1].containsMine) {
                                        j--;
                                    }

                                    grid[newY2][newX1].containsMine = true;
                                } else {
                                    if (grid[newY2][newX2].containsMine) {
                                        j--;
                                    }

                                    grid[newY2][newX2].containsMine = true;
                                }
                            }
                        }
                    }
                }

                checkMines();
            }

            if (!grid[mouseRow][mouseColumn].revealed) {
                grid[mouseRow][mouseColumn].revealSpace();
            }

            let revealedSquares = 0;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (grid[i][j].revealed) {
                        revealedSquares++;
                    }
                }
            }

            if (revealedSquares == rows*columns-mines && !lostGame) {
                alert("You Win!");
                lostGame = true;
            }

            draw();
        }
    }
});

canvas.addEventListener("mousemove", function(mouse) {
    mouseX = mouse.offsetX;
    mouseY = mouse.offsetY;

    if (!lostGame) {
        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        highlightedGrid = grid[mouseRow][mouseColumn];

        draw();
    }
});

document.addEventListener("keydown", function(key) {
    if (!lostGame && !key.repeat && key.keyCode == 32) {
        let mouseRow = Math.floor(mouseY/mineHeight);
        let mouseColumn = Math.floor(mouseX/mineWidth);

        if (mouseRow == rows) {
            mouseRow = rows-1;
        }

        if (mouseColumn == columns) {
            mouseColumn = columns-1;
        }

        if (!grid[mouseRow][mouseColumn].revealed) {
            if (grid[mouseRow][mouseColumn].flagged) {
                grid[mouseRow][mouseColumn].flagged = false;
            } else {
                grid[mouseRow][mouseColumn].flagged = true;
            }

            draw();
        }
    }
});

function draw() {
    graphics.clearRect(0, 0, width, height);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].draw();
        }
    }
}

draw();
