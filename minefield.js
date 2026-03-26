let currentBoard = [];
let xMax = null;
let yMax = null;
let bCount = null;

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
    generateField();
});

function generateBombs() {
    for (let i = 0; i < bCount; i++) {
        const x = Math.round(Math.random() * (xMax - 1))
        const y = Math.round(Math.random() * (yMax - 1))
        currentBoard[x][y] = 0xFF;
    }
}

function fillNumbers() {
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            let bombsNear = 0;
            if (x == 0) {

            } else if (x == xMax-1) {
                
            } else {

            }
            if (y == 0) {

            } else if (x == xMax-1) {
                
            } else {
                
            }
        }
    }

}

function generateBoard() {
    for (let i = 0; i < yMax; i++) {
        currentBoard.push([]);
    }
    currentBoard.forEach(col => {
        for (let i = 0; i < xMax; i++) {
            col.push(0);
        }
    });
    generateBombs();
    fillNumbers();
}

function initField() {
    for (let y = 0; y < yMax; y++) {
        for (let x = 0; x < xMax; x++) {
            const box = document.createElement("div");
            box.className = "playBox";
            box.id = y * xMax + x;
            box.style.left = x * 40 + "px";
            box.style.top = (-y) * (40 * (xMax - 1)) + (-x) * 40 + "px";
            playingField.appendChild(box);
        }
    }
}

function generateField() {
    generateBoard();
    initField();
}