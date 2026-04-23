let playingField = null;
let xWidth = null;
let yWidth = null;
let bombs = null;

function bombPercent() {
    bombs.max = xWidth.value * yWidth.value - 1;
    if (Number(bombs.value) > Number(bombs.max)) {
        bombs.value = bombs.max;
    }
    document.getElementById("bomb%").innerHTML = "the mine field will be " + (bombs.value / (xWidth.value * yWidth.value) * 100).toFixed(2) + "% bombs";
}

document.addEventListener("DOMContentLoaded", () => {
    let startButton = document.getElementById("start");
    startButton.addEventListener("click",()=>{
        switch (Math.floor(Math.random()*3)) {
            case 0:
                startButton.style.animationName="startClick1";startButton.style.animationDuration="250ms";startButton.style.animationTimingFunction="cubic-bezier(0, 0, 0.18, 1.82)";
                break;
            case 1:
                startButton.style.animationName="startClick2";startButton.style.animationDuration="1s";startButton.style.animationTimingFunction="cubic-bezier(0,0,0,1)";
                break;
            case 2:
                startButton.style.animationName="startClick2";startButton.style.animationDuration="250ms";startButton.style.animationTimingFunction="cubic-bezier(1,0,1,1)";
                break;
            default:
                break;
        }
    })
    playingField = document.getElementById("playingField");
    xWidth = document.getElementById("xWidth");
    yWidth = document.getElementById("yWidth");
    bombs = document.getElementById("bombs");
    bombPercent();
    bombs.addEventListener("change", bombPercent);
    xWidth.addEventListener("change", bombPercent);
    yWidth.addEventListener("change", bombPercent);
});