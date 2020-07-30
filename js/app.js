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
        if(!isPlaying || isGameOver) {
            startGame();
        }
    }

    if(e.keyCode == 32) {
        //Space bar key
        if(isPlaying) {
            rotateShape();
        }
    }

    if(e.keyCode == 37) {
        //Left key
        if(isPlaying) {
            moveDirection(-1);
        }
    }
    
    if(e.keyCode == 39) {
        //Right key
        if(isPlaying) {
            moveDirection(1);
        }
    }
    
    if(e.keyCode == 40) {
        //Bottom key
        if(isPlaying) {
            moveDown();
        }
    }
}

//Move shape left and right

function moveDirection(direction) {

    let validMove = true;

    if(currentShape == null) validMove = false;

    if(direction == -1 && validMove) {
        currentShape.forEach(element => {
            if((element) % columnsNbr == 0) validMove = false;
            if(blocks[element - 1] != null) {
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

//Rotate shape 

function rotateShape() {

    let validMove = true;
    let moveIndexes = null;

    if(currentShape == null) validMove = false;

    if(validMove) {

        //Horizontal I Shape
        if((currentShape[3] == currentShape[2] + 1) && ((currentShape[2] == currentShape[1] + 1)) && (currentShape[1] == currentShape[0] + 1))
            moveIndexes = [
                currentShape[0],
                currentShape[0] + columnsNbr,
                currentShape[0] + columnsNbr * 2,
                currentShape[0] + columnsNbr * 3,
            ];

        //Vertical I Shape
        if((currentShape[3] == currentShape[2] + columnsNbr) && ((currentShape[2] == currentShape[1] + columnsNbr)) && (currentShape[1] == currentShape[0] + columnsNbr))
            moveIndexes = [
                currentShape[0],
                currentShape[0] + 1,
                currentShape[0] + 2,
                currentShape[0] + 3,
            ];

        //O Shape
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[0] == currentShape[2] - columnsNbr)) && (currentShape[1] == currentShape[3] - columnsNbr))
            validMove = false;

        //L Shape to top
        if((currentShape[0] == currentShape[1] - columnsNbr) && ((currentShape[1] == currentShape[2] - columnsNbr)) && (currentShape[2] == currentShape[3] - 1))
            moveIndexes = [
                currentShape[0] + columnsNbr + 2,
                currentShape[0] + columnsNbr*2,
                currentShape[0] + columnsNbr*2 + 1,
                currentShape[0] + columnsNbr*2 + 2,
            ];

        //L Shape to right
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[0] == currentShape[3] - columnsNbr))
            moveIndexes = [
                currentShape[0],
                currentShape[0] + columnsNbr,
                currentShape[0] + columnsNbr*2,
                currentShape[0] + columnsNbr*2 + 1,
            ];

        //L Shape to bottom
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[1] == currentShape[2] - columnsNbr)) && (currentShape[2] == currentShape[3] - columnsNbr))
            moveIndexes = [
                currentShape[0] - 1,
                currentShape[0],
                currentShape[0] + 1,
                currentShape[0] + columnsNbr - 1,
            ];

        //L Shape to left
        if((currentShape[0] == currentShape[3] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - 1))
            moveIndexes = [
                currentShape[0] - columnsNbr - 1,
                currentShape[0] - columnsNbr,
                currentShape[0],
                currentShape[0] + columnsNbr,
            ];

        //J Shape to top
        if((currentShape[0] == currentShape[1] - columnsNbr) && ((currentShape[1] == currentShape[3] - columnsNbr)) && (currentShape[2] == currentShape[3] - 1)) 
            moveIndexes = [
                currentShape[0] - 2,
                currentShape[0] - 1,
                currentShape[0],
                currentShape[0] + columnsNbr,
            ];

        //J Shape to left
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0],
                currentShape[0] + 1,
                currentShape[0] + columnsNbr,
                currentShape[0] + columnsNbr*2,
            ];

        //J Shape to bottom
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[0] == currentShape[2] - columnsNbr)) && (currentShape[2] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0] + columnsNbr,
                currentShape[0] + columnsNbr*2,
                currentShape[0] + columnsNbr*2 + 1,
                currentShape[0] + columnsNbr*2 + 2,
            ];

        //J Shape to right
        if((currentShape[0] == currentShape[1] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - 1)) 
            moveIndexes = [
                currentShape[0] - columnsNbr + 2,
                currentShape[0] + 2,
                currentShape[0] + columnsNbr + 1,
                currentShape[0] + columnsNbr + 2,
            ];

        //T Shape to top
        if((currentShape[0] == currentShape[2] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - 1)) 
            moveIndexes = [
                currentShape[0] - columnsNbr + 1,
                currentShape[0],
                currentShape[0] + 1,
                currentShape[0] + columnsNbr + 1,
            ];

        //T Shape to left
        if((currentShape[0] == currentShape[2] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0] - 2,
                currentShape[0] - 1,
                currentShape[0],
                currentShape[0] + columnsNbr - 1,
            ];

        //T Shape to bottom
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[1] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0],
                currentShape[0] + columnsNbr,
                currentShape[0] + columnsNbr + 1,
                currentShape[0] + columnsNbr*2,
            ];

        //T Shape to right
        if((currentShape[0] == currentShape[1] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[1] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0] + columnsNbr + 1,
                currentShape[0] + columnsNbr*2,
                currentShape[0] + columnsNbr*2 + 1,
                currentShape[0] + columnsNbr*2 + 2,
            ];

        //S Shape to right
        if((currentShape[0] == currentShape[3] - columnsNbr) && ((currentShape[0] == currentShape[1] - 1)) && (currentShape[2] == currentShape[3] - 1)) 
            moveIndexes = [
                currentShape[0] - columnsNbr - 1,
                currentShape[0] - 1,
                currentShape[0],
                currentShape[0] + columnsNbr,
            ];

        //S Shape to top
        if((currentShape[0] == currentShape[1] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[2] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0] + columnsNbr + 1,
                currentShape[0] + columnsNbr + 2,
                currentShape[0] + columnsNbr*2,
                currentShape[0] + columnsNbr*2 + 1,
            ];

        //Z Shape to left
        if((currentShape[0] == currentShape[1] - 1) && ((currentShape[1] == currentShape[2] - columnsNbr)) && (currentShape[2] == currentShape[3] - 1)) 
            moveIndexes = [
                currentShape[0] - columnsNbr + 2,
                currentShape[0] + 1,
                currentShape[0] + 2,
                currentShape[0] + columnsNbr + 1,
            ];

        //Z Shape to bottom
        if((currentShape[0] == currentShape[2] - columnsNbr) && ((currentShape[1] == currentShape[2] - 1)) && (currentShape[1] == currentShape[3] - columnsNbr)) 
            moveIndexes = [
                currentShape[0] + columnsNbr - 2,
                currentShape[0] + columnsNbr - 1,
                currentShape[0] + columnsNbr*2 - 1,
                currentShape[0] + columnsNbr*2,
            ];

    }

    if(moveIndexes != null) {
        moveIndexes.forEach(index => {
            if(blocks[index] == null) validMove = false;
            else if(blocks[index].classList.contains('stopped')) validMove = false;
        });

        for(let i = 0; i < moveIndexes.length; i++) {

            let distance = (moveIndexes[i] % columnsNbr - moveIndexes[0] % columnsNbr);
            distance = distance >= 0 ? distance : -distance;

            if(distance > moveIndexes.length) validMove = false;

        }

    }

    if(validMove && moveIndexes != null) {

        //Rotate Shape
        for(let i = 0; i < currentShape.length; i++) {

            blocks[currentShape[i]].classList = '';
            currentShape[i] = moveIndexes[i];

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

    let index = columnsNbr * rowsNbr - 1;
    
    blocks.forEach(block => {
        
        if(index % columnsNbr == 0) {
            
            let validRow = true;

            for(let i = index; i < index + columnsNbr; i++) {
                if(!blocks[i].classList.contains('stopped')) validRow = false;
            }
            
            if(validRow) {
                
                currentScore += columnsNbr * speed * 10;
                score.textContent = currentScore + ' pts';

                speed += 0.1;
                clearInterval(gameIntervalTimer)
                gameIntervalTimer = setInterval(update, 1000 / speed);

                isPlaying = false;
                clearRow(index);

            }

        }
        
        index--;
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

    isPlaying = true;

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

        //LocalStorage
        let currentHighScore = localStorage.getItem('highScore');

        if(currentHighScore != null) {
            if(currentScore > currentHighScore) {
                //New HighScore
                localStorage.setItem('highScore', currentScore);
                score.classList.add('highScore');
                score.textContent = 'New HighScore : '+ currentScore;
            }
        } else {
            if(currentScore > 0) {
                localStorage.setItem('highScore', currentScore);
                score.classList.add('highScore');
                score.textContent = 'New HighScore : '+ currentScore;
            }
        }

    }

}