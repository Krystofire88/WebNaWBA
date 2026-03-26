let currentBoard = null;
let xMax = null;
let yMax = null;
let bCount = null;
let boxClicked = [0, 0];
let firstClick = true;

let playingField = null;
let timeDisplay = null;
let bombsLeft = null;

document.addEventListener("DOMContentLoaded", () => {
    let paramString = window.location.href.split('?')[1];
    let queryString = new URLSearchParams(paramString);
    for (let pair of queryString.entries()) {
        switch (pair[0]) {
            case "xWidth":
                xMax = pair[1];
                break;
            case "yWidth":
                yMax = pair[1];
                break;
            case "bombs":
                bCount = pair[1];
                break;
            default:
                break;
        }
    }
    playingField = document.getElementById("playingField");
    timeDisplay = document.getElementById("timeDisplay");
    bombsLeft = document.getElementById("bombsLeft");
    timeDisplay.textContent = 0
    setInterval(() => {
        timeDisplay.textContent = Number(timeDisplay.textContent)+1;
    }, 1000);
    generateField();
});


function generateBombs() {
    if (bCount > xMax*yMax-1) {
        bCount = xMax*yMax-1;
    }
    for (let i = 0; i < bCount; i++) {       
        const x = Math.floor(Math.random() * xMax)
        const y = Math.floor(Math.random() * yMax)
        if(currentBoard[y][x] == -1)
        {
            i--;
            continue;
        }
        
        if (x === boxClicked[0] && y === boxClicked[1]) {
            i--;
            continue;
        }
        currentBoard[y][x] = -1;
    }    
}

function fillNumbers() {
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if(currentBoard[y][x] == -1)
            {
                continue;
            }
            let bombsNear = 0;
            for(let i = 0; i < 8; i++)
            {
                let checkX = 0;
                let checkY = 0;
                switch(i)
                {
                    case 0:
                        checkY = -1;
                        checkX = -1;
                        break;
                    case 1:
                        checkY = -1;
                        checkX =  0;
                        break;
                    case 2:
                        checkY = -1;
                        checkX = +1;
                        break;
                    case 3:
                        checkY =  0;
                        checkX = +1;
                        break;
                    case 4:
                        checkY = +1;
                        checkX = +1;
                        break;
                    case 5:
                        checkY = +1;
                        checkX =  0;
                        break;
                    case 6:
                        checkY = +1;
                        checkX = -1;
                        break;
                    case 7:
                        checkY =  0;
                        checkX = -1;
                        break;
                    default:
                        checkX =  0;
                        checkY =  0;
                        break;
                }
                if(currentBoard[y + checkY]?.[x + checkX] != null) // '?.' <= poradilo chatGPT  
                {
                    if(currentBoard[y + checkY][x + checkX] == -1)
                    {
                        bombsNear++;
                    }
                }
            }
            currentBoard[y][x] = bombsNear;
        }
    }
}

function generateBoard() {
    currentBoard = [];
    for (let i = 0; i < yMax; i++) {
        currentBoard.push([]);
    }
    currentBoard.forEach(col => {
        for (let i = 0; i < xMax; i++) {
            col.push(0);    
        }
    });
    generateBombs();
    console.log(currentBoard);
    fillNumbers();
}

function initField() {
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            const box = document.createElement("div");
            box.className = "playBox";
            box.id = y * xMax + x;
            let thisID = [x, y]; 
            box.style.left = x * 40 + "px";
            box.style.top = (-y) * (40 * (xMax - 1)) + (-x) * 40 + "px";
            let txt = currentBoard[y][x];
            if(txt == -1)
            {
                txt = "B";
            }
            box.innerText = txt;
            if(firstClick)
            {
            box.addEventListener("click", () => clickedBox(thisID));    
            }
            playingField.appendChild(box);
        }
    }
}

function clickedBox(id)
{
    firstClick = false;
    boxClicked = id;
    generateField();
}

function generateField() {
    let len = playingField.children.length;
    for (let i = 0; i < len; i++) {
        playingField.children[0].remove();
    }
    generateBoard();
    initField();
}
