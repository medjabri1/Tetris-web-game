const title = document.querySelector('.title');
const score = document.querySelector('.score');
const grid = document.querySelector('.grid');
const rowsNbr = 20;
const columnsNbr = 10;
let currentScore = 0;
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

let speed = 1;
let gameIntervalTimer;
let currentShape = null;
let currentColor = null;

document.addEventListener('DOMContentLoaded', create);
document.addEventListener('keydown', control);

//MAIN FUNCTIONS

function create() {

    blocks = [];

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

    checkForLost();

    if(isPlaying && !isGameOver) {

        checkValidRows();

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
    isGameOver = false;
    title.classList.remove('lost');
    title.textContent = 'Enjoy your time';
    currentScore = 0;
    score.textContent = '0 pts';
    gameIntervalTimer = setInterval(update, 1000 / speed);
    speed = 1;
    create();
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

//Check valid rows 

function checkValidRows() {

    let index = 0;
    
    blocks.forEach(block => {
        
        if(index % columnsNbr == 0) {
            
            let validRow = true;

            for(let i = index; i < index + columnsNbr; i++) {
                if(!blocks[i].classList.contains('stopped')) validRow = false;
            }
            
            if(validRow) {
                
                currentScore += columnsNbr * speed * 10;
                score.textContent = currentScore + ' pts';
                speed += 0.2;
                clearRow(index);

            }

        }
        
        index++;
    });

}

//Clear one row

function clearRow(index) {

    for(let i = index; i < index + columnsNbr; i++) {
        blocks[i].classList = "";
    }

    let cpt = index - 1;

    while(cpt >= 0) {

        if(blocks[cpt].classList.contains('stopped')) {

            blocks[cpt + columnsNbr].classList = blocks[cpt].classList;
            blocks[cpt].classList = "";

        }

        cpt--;
    }

}

//Check for lost 

function checkForLost() {

    let lost = false;

    for(let i = 0; i < columnsNbr; i++) {

        if(blocks[i].classList.contains('stopped')) {
            lost = true;
        }

    }

    if(lost) {

        isGameOver = true;
        title.textContent = 'You Lost, press enter to start again';
        title.classList.add('lost');
        clearInterval(gameIntervalTimer);
        speed = 1;

    }

}