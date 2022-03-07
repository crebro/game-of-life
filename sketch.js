
let grid = [];
let rowNums;
let colNums;
let gridWidth;
let gridHeight;
let squareSize = 20;
let simulationBegun = false;
let framesPerSecond = 50;
let p5Frames = 60;
let frames = framesPerSecond * 60;
let lastClickedSquare = {row: Number.POSITIVE_INFINITY, col: Number.NEGATIVE_INFINITY};
let originalSquareSize = squareSize;


function initializeGrid(base) {
    grid = [];
    for (let i = 0; i < rowNums; i++) {
        grid.push([]);
        for (let j = 0; j < colNums; j++) {
            try {
                grid[i].push(base[i][j]);
            } catch (e) {
                grid[i].push(0);
            }
        }
    }
}

async function loadTemplate(templateUrl) {
    const response = await fetch(templateUrl);
    const data = await response.json();
    initializeGrid(data);
    return data;
}

function setup() {

    rowNums = Math.floor(windowHeight / squareSize);
    colNums = Math.floor(windowWidth / squareSize);
    gridHeight = rowNums * squareSize;
    gridWidth = colNums * squareSize;

    

    const controlPanel = document.createElement('div', );

    controlPanel.innerHTML = `
      <div class="input-panel-1">
        <div class="input-item"> <div>Frames Per Second:</div> &nbsp; <input type="range" min="1" max="100" id="frames-per-second-input"></div>
        <div class="input-item"> <div>Square Size: </div> &nbsp; <input type="range" min="1" max="100" id="square-size-input" value="100"></div>
      </div>
      <div> 
        <div> Load Prebuilt maps </div>
        <button class="button" onclick="loadTemplate('templates/gosperglidergun.json');"> Gosper Glider Gun </button>
        <button class="button" onclick="loadTemplate('templates/diamond.json');"> Diamond </button>
      </div>
    `;
    controlPanel.classList.add('control-panel');

    document.getElementsByTagName('body')[0].prepend(controlPanel);

    document.getElementById('frames-per-second-input').addEventListener('change', (e) => {
        framesPerSecond = parseInt(e.currentTarget.value);
    })

    document.getElementById('square-size-input').addEventListener('change', (e) => {
        squareSize = originalSquareSize * ( 2 - e.currentTarget.value / 100 ) ;
    })

    createCanvas(gridWidth, gridHeight);
    initializeGrid();

}

function draw() {
    frameRate(p5Frames);
    background(0);

    stroke(255, 255, 255);
    for (i = 0; i < rowNums; i++)  {
        line(0, i * squareSize, gridWidth, i * squareSize);
    }
    for (i = 0; i < colNums; i++)  {
        line(i * squareSize, 0, i * squareSize, gridHeight);
    }

    fill(255, 255, 255);
    for (let i = 0; i < rowNums; i++) {
        for (let j = 0; j < colNums; j++) {
            if (grid[i][j] === 1) {
                rect(j * squareSize, i * squareSize, squareSize, squareSize);
            }
        }
    }

    frames += 1;
    if (frames > (1 / framesPerSecond * p5Frames)) {
        if (simulationBegun) {
            grid = calculateNextGeneration();
        }
        frames = 0;
    }
}

function mouseClickAction() {
    let row = Math.floor(mouseY / squareSize);
    let col = Math.floor(mouseX / squareSize);

    if (!simulationBegun && !( lastClickedSquare.row === row && lastClickedSquare.col === col )) {
        let item = grid[row][col];
        grid[row][col] = item === 1 ? 0 : 1;

        lastClickedSquare.row = row;
        lastClickedSquare.col = col; 
    }
}

function mouseClicked() {
    mouseClickAction();
}

function mouseDragged() {
    mouseClickAction();
}

function keyPressed() {
    if (keyCode === 32) {
        simulationBegun = !simulationBegun;
    }
}

function calculateNextGeneration() {
    let newGrid = [];
    for (let i = 0; i < rowNums; i++) {
        newGrid.push([]);
        for (let j = 0; j < colNums; j++) {
            if (i === 0 || j === 0 || i === rowNums - 1 || j === colNums - 1) {
                newGrid[i].push(0);
                continue;
            }

            let aliveCells = 0;
            for (let r = i - 1; r <= i + 1; r++ ) {
                for (let c = j - 1; c <= j + 1; c++) {
                    if (r === i && c === j) {
                        continue;
                    }

                    if (grid[r][c] === 1) {
                        aliveCells += 1;
                    }
                }
            }

            if (grid[i][j] === 0 && aliveCells === 3) {
                newGrid[i].push(1);
                continue;
            }
            if (grid[i][j] === 1 && (aliveCells === 2 || aliveCells === 3) ) {
                newGrid[i].push(1);
                continue;
            }

            newGrid[i].push(0);
        }
    }

    return newGrid;
}
