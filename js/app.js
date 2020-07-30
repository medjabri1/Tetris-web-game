const title = document.querySelector('.title');
const score = document.querySelector('.score');
const grid = document.querySelector('.grid');
const rowsNbr = 20;
const columnsNbr = 10;
const currentScore = 0;
let isPlaying = false;
let isGameOver = false;
let blocks = [];
let center = columnsNbr / 2 - 1;

const I_SHAPE = [0 + center, 1 + center, 2 + center, 3 + center];
const J_SHAPE = [0 + center, columnsNbr + center, columnsNbr+1 + center, columnsNbr+2 + center];
const L_SHAPE = [2 + center, columnsNbr + center, columnsNbr+1 + center, columnsNbr+2 + center];
const O_SHAPE = [0 + center, 1 + center, columnsNbr + center, columnsNbr+1 + center];
const S_SHAPE = [1 + center, 2 + center, columnsNbr + center, columnsNbr+1 + center];
const T_SHAPE = [1 + center, columnsNbr + center, columnsNbr+1 + center, columnsNbr+2 + center]
const Z_SHAPE = [0 + center, 1 + center, columnsNbr+1 + center, columnsNbr+2 + center];

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

    if(isPlaying && !isGameOver) {

        if(currentShape == null) {

            currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)].slice();
            drawShape();

        } else {

            moveDown();

        }

    }

}

//HELPER FUNCTIONS

function startGame() {
    document.querySelector('.pop-up').classList.remove('active');
    isPlaying = true;
}

//Key control

function control(e) {

    if(e.keyCode == 13) {
        //Enter key
        startGame();
    }

    if(e.keyCode == 37) {
        //Left key
        moveDirection(-1);
    }
    
    if(e.keyCode == 39) {
        //Right key
        moveDirection(1);
    }
    
    if(e.keyCode == 40) {
        //Bottom key
        moveDown();
    }
}

//Move shape left and right

function moveDirection(direction) {

    let validMove = true;

    if(currentShape == null) validMove = false;

    if(direction == -1 && validMove) {
        currentShape.forEach(element => {
            if((element) % columnsNbr == 0) validMove = false;
            if(blocks[element] != null) {
                if(blocks[element - 1].classList.contains('stopped')) validMove = false;
            }
        });
    }
    
    if(direction == 1 && validMove) {
        currentShape.forEach(element => {
            if((element + 1) % columnsNbr == 0) validMove = false;
            if(blocks[element + 1] != null) {
                if(blocks[element + 1].classList.contains('stopped')) validMove = false;
            }
        });
    }

    if(validMove) {

        for(let i = 0; i < currentShape.length; i++) {
    
            blocks[currentShape[i]].classList = "";
    
            currentShape[i] += direction;
        }
    
        drawShape();

    }

}

//Draw shape in grid

function drawShape() {

    let colors = ['red', 'blue', 'orange', 'green'];
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    currentColor = currentColor != null ? currentColor : randomColor;

    currentShape.forEach(element => {
        blocks[element].classList.add('currentShape');    
        blocks[element].classList.add(currentColor);    
    });
}

//Move shape down

function moveDown() {

    if(!checkCurrentShape()) {

        blockCurrentShape();

    } else {

        blocks.forEach(block => {
            if(block.classList.contains('currentShape')) {
                block.classList = '';
            }
        });
    
        for(let i = 0; i < currentShape.length; i++) {
            currentShape[i] += columnsNbr;
        }
    
        drawShape();

    }

    
}

//Check if shape reach bottom

function checkCurrentShape() {

    if(currentShape == null) {
        return false;
    }

    for(let i = 0; i < currentShape.length; i++) {

        let element = currentShape[i];

        if((element + columnsNbr) > columnsNbr * rowsNbr) {
            return false;
        }
        
        if(blocks[element + columnsNbr] != null) {
            if(blocks[element + columnsNbr].classList.contains('stopped')) {
                return false;
            }
        }

    }

    return true;
}

//Block current Shape

function blockCurrentShape() {

    blocks.forEach(block => {
        if(block.classList.contains('currentShape')) {
            block.classList.remove('currentShape');
            block.classList.add('stopped');
        }
    });

    currentShape = null;
    currentColor = null;


}