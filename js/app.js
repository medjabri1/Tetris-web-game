const title = document.querySelector('.title');
const score = document.querySelector('.score');
const grid = document.querySelector('.grid');
const rowsNbr = 20;
const columnsNbr = 10;
const currentScore = 0;
let isPlaying = false;
let isGameOver = false;
let blocks = [];

const I_SHAPE = [0, 1, 2, 3];
const J_SHAPE = [0, columnsNbr, columnsNbr+1, columnsNbr+2];
const L_SHAPE = [2, columnsNbr, columnsNbr+1, columnsNbr+2];
const O_SHAPE = [0, 1, columnsNbr, columnsNbr+1];
const S_SHAPE = [1, 2, columnsNbr, columnsNbr+1];
const T_SHAPE = [1, columnsNbr, columnsNbr+1, columnsNbr+2]
const Z_SHAPE = [0, 1, columnsNbr+1, columnsNbr+2];

const SHAPES = [I_SHAPE, J_SHAPE, L_SHAPE, O_SHAPE, S_SHAPE, T_SHAPE, Z_SHAPE];

let speed = 2;
let gameIntervalTimer = setInterval(update, 1000 / speed);
let currentShape = null;
let currentColor = null;

document.addEventListener('DOMContentLoaded', create);
document.addEventListener('keydown', control);

//MAIN FUNCTIONS

function create() {

    grid.querySelectorAll('div').forEach(div => {
        grid.removeChild(div);
    });

    for(let i = 0; i < rowsNbr * columnsNbr; i++) {

        let block = document.createElement('div');
        grid.appendChild(block);
        blocks.push(block);

    }
    
}

function update() {

    if(isPlaying) {

        checkCurrentShape();

        if(currentShape == null) {

            currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            drawShape(currentShape);

        } else {

            moveDown();

        }

    }

}

//HELPER FUNCTIONS

function startGame(modal) {
    modal.classList.remove('active');
    isPlaying = true;
}

//Key control

function control(e) {

    if(e.keyCode == 37) {
        moveDirection(-1);
    }
    
    if(e.keyCode == 39) {
        moveDirection(1);
    }
    
    if(e.keyCode == 40) {
        moveDown();
    }
}

//Move shape left and right

function moveDirection(direction) {

    if(currentShape == null) return;

    if(direction == -1) {
        currentShape.forEach(element => {
            let center = columnsNbr/2 + 2
            if((element - center) % columnsNbr == 0) return;
        });
    }

    if(direction == 1) {
        currentShape.forEach(element => {
            if(element % columnsNbr == 0) return;
        });
    }

    for(let i = 0; i < currentShape.length; i++) {

        let center = columnsNbr / 2 - 2;
        blocks[currentShape[i] + center].classList = "";

        currentShape[i] += direction;
    }

    drawShape(currentShape);

}

//Draw shape in grid

function drawShape(shape) {

    let colors = ['red', 'blue', 'orange', 'green'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    currentColor = currentColor != null ? currentColor : randomColor;

    let center = columnsNbr / 2 - 2;

    shape.forEach(element => {
        blocks[element + center].classList.add('currentShape');    
        blocks[element + center].classList.add(currentColor);    
    });
}

//Move shape down

function moveDown() {

    for(let i = 0; i < currentShape.length; i++) {

        let center = columnsNbr / 2 - 2;
        blocks[currentShape[i] + center].classList = "";

        currentShape[i] += columnsNbr;
    }

    drawShape(currentShape);
    
}

//Check if shape reach bottom

function checkCurrentShape() {

    let stopped = false;

    if(currentShape == null) {
        blockCurrentShape;
        return;
    }

    for(let i = 0; i < currentShape.length; i++) {

        let element = currentShape[i];

        if((element + columnsNbr) > blocks.length) {
            stopped = true;
            break;
        }

        if(blocks[element + columnsNbr] != null) {
            if(blocks[element + columnsNbr].classList.contains('stopped')) {
                stopped = true;
                break;
            }
        }

    }

    if(stopped == true) blockCurrentShape();

}

//Block current Shape

function blockCurrentShape() {

    currentShape.forEach(element => {
        blocks[element].classList.remove('currentShape')
        blocks[element].classList.add('stopped')
    });

    currentShape = null;
    currentColor = null;

}