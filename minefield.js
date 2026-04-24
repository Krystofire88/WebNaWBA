let currentBoard = null;
let xMax = null;
let yMax = null;
let bCount = null;
let flagCount = null;
let boxClicked = [0, 0];
let firstClick = true;

let playingField = null;
let timeDisplay = null;
let flagsLeft = null;
let time = 0;
let timerInterval = null;

const bombNum = 0x09;

class Tile
{
    isUncovered = false;
    isBomb;
    value;
    isFlagged = false;
    constructor(isBomb, value)
    {
        this.isBomb = isBomb;
        this.value = value;
    }
}

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
                flagCount = bCount;
                break;
            default:
                break;
        }
    }
    playingField = document.getElementById("playingField");
    timeDisplay = document.getElementById("timeDisplay");
    flagsLeft = document.getElementById("flagsLeft");
    backgroundMusic = document.getElementById("audio");
    playPause = document.getElementById("play-pause");
    backgroundMusic.play();
    backgroundMusic.muted = false;
    backgroundMusic.volume = 0.1;
    initFlagsTime();
    generateField();
});

function initFlagsTime()
{
    flagCount = bCount;
    flagsLeft.textContent = "Flags left: " + flagCount;

    time = 0;

    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        time++;
        timeDisplay.textContent = "Time elapsed: " + time;
    }, 1000);
}

function generateBombs() {
    if (bCount > xMax * yMax - 1) {
        bCount = xMax * yMax - 1;
    }
    for (let i = 0; i < bCount; i++) {
        const x = Math.floor(Math.random() * xMax)
        const y = Math.floor(Math.random() * yMax)
        if (currentBoard[y][x].isBomb) {
            i--;
            continue;
        }

        if (y === boxClicked[0] && x === boxClicked[1]) {
            i--;
            continue;
        }
        bomb = new Tile(true, bombNum)
        currentBoard[y][x] = bomb;
    }
}

function fillNumbers() {
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            if (currentBoard[y][x].isBomb) {
                continue;
            }
            let bombsNear = 0;
            for (let i = 0; i < 8; i++) {
                let dir = directionSwitch(i);
                if (currentBoard[y + dir[0]]?.[x + dir[1]] != null) // '?.' <= poradilo chatGPT  
                {
                    if (currentBoard[y + dir[0]][x + dir[1]].isBomb) {
                        bombsNear++;
                    }
                }
            }
            tile = new Tile(false, bombsNear);
            currentBoard[y][x] = tile;
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
            let thisID = [y, x];
            box.style.left = x * 40 + "px";
            box.style.top = (-y) * (40 * (xMax - 1)) + (-x) * 40 + "px";
            if (firstClick) {
                box.addEventListener("click", () => clickedRevealBox(thisID));
            }
            else {
                box.addEventListener("contextmenu", (e) => { e.preventDefault(); makeFlag(thisID); }); // <== "e.preventDefault();" chatGPT code 
                box.addEventListener("click", () => clickedBox(thisID));
            }
            box.innerText = " ";
            playingField.appendChild(box);
        }
    }
}

function clickedRevealBox(id) {
    firstClick = false;
    boxClicked = id;
    generateField();
    currentBoard[id[0]][id[1]].isUncovered = true;
    revealNear(id);
    regenBoard(false);
}

function clickedBox(id) {
    if(currentBoard[id[0]][id[1]].isFlagged) return;
    else if (currentBoard[id[0]][id[1]].isBomb) {
        lose()
    }
    else if (currentBoard[id[0]][id[1]].isUncovered == false)
    {
        currentBoard[id[0]][id[1]].isUncovered = true;
        revealNear(id)
        regenBoard(false);
        checkWin();
    }
    else if (currentBoard[id[0]][id[1]].isUncovered)
    {
        autoUncover(id);
        regenBoard(false);
        checkWin(); 
    }
}

function autoUncover(id)
{
    let numberOfFlags = 0;
    for (let i = 0; i < 8; i++) {
        let dir = directionSwitch(i);
        if(currentBoard[id[0] + dir[0]]?.[id[1] + dir[1]] != null)
        {
            if (!currentBoard[id[0] + dir[0]][id[1] + dir[1]].isUncovered)
            {
                if (currentBoard[id[0] + dir[0]][id[1] + dir[1]].isFlagged)
                {
                    numberOfFlags++;
                }
            }
        }
    }
    if(numberOfFlags == currentBoard[id[0]][id[1]].value)
    {
        for (let i = 0; i < 8; i++) {
            let dir = directionSwitch(i);
            if(currentBoard[id[0] + dir[0]]?.[id[1] + dir[1]] != null)
            {
                if (!currentBoard[id[0] + dir[0]][id[1] + dir[1]].isUncovered)
                {
                    if (!currentBoard[id[0] + dir[0]][id[1] + dir[1]].isFlagged)
                    {
                        if(currentBoard[id[0] + dir[0]][id[1] + dir[1]].isBomb)
                        {
                            lose();
                        }
                        currentBoard[id[0] + dir[0]][id[1] + dir[1]].isUncovered = true;
                        if (currentBoard[id[0] + dir[0]][id[1] + dir[1]].value == 0) {
                            let newid = [id[0] + dir[0], id[1] + dir[1]];
                            revealNear(newid);
                        }
                    }
                }
            }
        }
    }
}

function lose()
{
    regenBoard(true);
    setTimeout(() => { 
        window.alert("GAME OVER");
        resetBoard();     
    }, 10);
}

function checkWin()
{
    for (let y = 0; y < yMax; y++)
    {
        for (let x = 0; x < xMax; x++) 
        { 
            if(currentBoard[y][x].isBomb) continue;
            if(!currentBoard[y][x].isUncovered) return;
        }
    }
    win();
}

function win()
{
    regenBoard(true);
    setTimeout(() => {
        window.alert("You Win");
        resetBoard();     
    }, 10);
}

function resetBoard()
{
    for (let y = 0; y < yMax; y++)
    {
        for (let x = 0; x < xMax; x++) 
        { 
            currentBoard[y][x].isUncovered = false;
            currentBoard[y][x].isFlagged = false;
        }
    }
    firstClick = true;
    generateField();
    initFlagsTime();
}

function revealNear(id)
{
    if(currentBoard[id[0]][id[1]].value == 0)
    {
        for (let i = 0; i < 8; i++) {
            let dir = directionSwitch(i);
            if(currentBoard[id[0] + dir[0]]?.[id[1] + dir[1]] != null)
            {
                if (!currentBoard[id[0] + dir[0]][id[1] + dir[1]].isUncovered)
                {
                    currentBoard[id[0] + dir[0]][id[1] + dir[1]].isUncovered = true;
                    if (currentBoard[id[0] + dir[0]][id[1] + dir[1]].value == 0) {
                        let newid = [id[0] + dir[0], id[1] + dir[1]];
                        revealNear(newid);
                    }
                }   
            }
        }
    }
}

function regenBoard(explode)
{
    if(explode)
    {
        for (let y = 0; y < yMax; y++)
        {
            for (let x = 0; x < xMax; x++)
            {
                if (currentBoard[y][x].isBomb)
                {
                    currentBoard[y][x].isUncovered = true;
                    if(currentBoard[y][x].value == 25)
                    {
                        currentBoard[y][x].value = bombNum;
                    }
                }
            }
        }
    }
    for (let y = 0; y < yMax; y++) 
    {
        for (let x = 0; x < xMax; x++)
        {
            let txt = currentBoard[y][x].value;
            if (txt == bombNum) {
                txt = "B";
            }
            if(currentBoard[y][x].isUncovered)
            {
                playingField.children[y * xMax + x].innerHTML = tileImages[txt];
            }
        }
    }
}

function makeFlag(id) {
    let boxDiv = document.getElementById(id[0] * xMax + id[1])
    if (!currentBoard[id[0]][id[1]].isFlagged && flagCount > 0 && !currentBoard[id[0]][id[1]].isUncovered) {
        currentBoard[id[0]][id[1]].isFlagged = true;
        boxDiv.innerHTML = tileImages["F"];
        flagCount--;
        flagsLeft.textContent = "Flags left: " + flagCount;
    }
    else if (currentBoard[id[0]][id[1]].isFlagged) {
        currentBoard[id[0]][id[1]].isFlagged = false;
        boxDiv.innerText = " ";
        flagCount++;
        flagsLeft.textContent = "Flags left:" + flagCount;
    } else {
        console.warn(currentBoard[id[0]][id[1]].value)
        console.warn((currentBoard[id[0]][id[1]].value & 0x10))
    }
}

function directionSwitch(i)
{
    let checkY = 0;
    let checkX = 0;
    switch (i) {
        case 0:
            checkY = -1;
            checkX = -1;
            break;
        case 1:
            checkY = -1;
            checkX = 0;
            break;
        case 2:
            checkY = -1;
            checkX = +1;
            break;
        case 3:
            checkY = 0;
            checkX = +1;
            break;
        case 4:
            checkY = +1;
            checkX = +1;
            break;
        case 5:
            checkY = +1;
            checkX = 0;
            break;
        case 6:
            checkY = +1;
            checkX = -1;
            break;
        case 7:
            checkY = 0;
            checkX = -1;
            break;
        default:
            checkX = 0;
            checkY = 0;
            break;
    }
    return [checkY, checkX];
}

function generateField() {
    let len = playingField.children.length;
    for (let i = 0; i < len; i++) {
        playingField.children[0].remove();
    }
    generateBoard();
    initField();
}

function togglePlay() {
    if (backgroundMusic.paused)
    {
        backgroundMusic.play();
        playPause.textContent = "Pause";
    }
    else 
    {
        backgroundMusic.pause();
        playPause.textContent = "Play";
    }
}

const tileImages = {
    "B": '<img src="assets/bomb.png">',
    "F": '<img src="assets/flag.png">',
    0:   '<img src="assets/zero.png">',
    1:   '<img src="assets/one.png">',
    2:   '<img src="assets/two.png">',
    3:   '<img src="assets/three.png">',
    4:   '<img src="assets/four.png">',
    5:   '<img src="assets/five.png">',
    6:   '<img src="assets/six.png">',
    7:   '<img src="assets/seven.png">',
    8:   '<img src="assets/eight.png">',
};