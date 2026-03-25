let currentBoard = null;
let xMax = null;
let yMax = null;
let bCount = null;

let playingField = null;
let xWidth = null;
let yWidth = null;
let bombs = null;

function bombPercent() {
    bombs.max = xWidth.value * yWidth.value - 1;
    if (Number(bombs.value) > Number(bombs.max)) {
        bombs.value = bombs.max;
    }
    document.getElementById("bomb%").innerHTML = "the mine field will be " + (bombs.value / (xWidth.value * yWidth.value) * 100).toFixed(2) + "% bombs or less";
}

document.addEventListener("DOMContentLoaded", () => {
    playingField = document.getElementById("playingField");
    xWidth = document.getElementById("xWidth");
    yWidth = document.getElementById("yWidth");
    bombs = document.getElementById("bombs");
    bombPercent();
    bombs.addEventListener("change", bombPercent);
    xWidth.addEventListener("change", bombPercent);
    yWidth.addEventListener("change", bombPercent);
});

function generateBombs() {
    for (let i = 0; i < bCount; i++) {
        const x = Math.round(Math.random()*(xMax-1))
        const y = Math.round(Math.random()*(yMax-1))
        currentBoard[x][y] = 0xFF;
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
    xMax = xWidth.value;
    yMax = yWidth.value;
    bCount = bombs.value;
    generateBoard();
    const len = playingField.children.length;
    for (let i = 0; i < len; i++) {
        playingField.children[0].remove();
    }
    initField();
}