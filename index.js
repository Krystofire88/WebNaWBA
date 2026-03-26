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