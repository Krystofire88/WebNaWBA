let playingField = null;
let xWidth = null;
let yWidth = null;
let bombs = null;

function bombPercent() {
    bombs.max = xWidth.value * yWidth.value - 1;
    if (Number(bombs.value) > Number(bombs.max)) {
        bombs.setAttribute("value", bombs.max.toString());
    }
    document.getElementById("bomb%").innerHTML = "Density: " + (bombs.value / (xWidth.value * yWidth.value) * 100).toFixed(2) + "%";
}

class CustomRange extends HTMLElement {
    static observedAttributes = ["color", "size", "value", "min", "max"];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        this.backdrop = document.createElement("div");
        this.upArrow = document.createElement("div");
        this.downArrow = document.createElement("div");
        this.upArrowIcon = document.createElement("img");
        this.downArrowIcon = document.createElement("img");
    }

    shadow = "";
    backdrop = "";
    upArrow = "";
    downArrow = "";
    downArrowIcon = "";
    upArrowIcon = "";
    value = 0;
    changed = new Event("change", { composed: true });
    min = Number.MIN_SAFE_INTEGER;
    max = Number.MAX_SAFE_INTEGER;

    connectedCallback() {
        this.backdrop.style.backgroundColor = "#E4AEA2";
        this.backdrop.style.borderTopLeftRadius = "8px";
        this.backdrop.style.borderBottomLeftRadius = "8px";
        this.backdrop.style.color = "#000000";
        this.backdrop.style.fontFamily = "Inter";
        this.backdrop.style.fontSize = "48px";
        this.backdrop.innerText = this.value.toString();
        this.backdrop.style.width = "120px";
        this.backdrop.style.height = "64px";
        this.backdrop.style.textAlign = "center";
        this.backdrop.style.display = "flex";
        this.backdrop.style.justifyContent = "center";
        this.backdrop.style.alignItems = "center";
        this.upArrow.style.backgroundColor = "#7E2828";
        this.downArrow.style.backgroundColor = "#7E2828"
        this.upArrow.style.width = "32px";
        this.upArrow.style.height = "32px";
        this.upArrow.style.position = "absolute";
        this.upArrow.style.marginTop = "-64px";
        this.upArrow.style.marginLeft = "120px";
        this.downArrow.style.marginTop = "-32px";
        this.downArrow.style.marginLeft = "120px";
        this.upArrow.style.display = "flex";
        this.upArrow.style.justifyItems = "center";
        this.upArrow.style.alignItems = "center";
        this.downArrow.style.display = "flex";
        this.downArrow.style.justifyItems = "center";
        this.downArrow.style.alignItems = "center";
        this.downArrow.style.width = "32px";
        this.downArrow.style.height = "32px";
        this.upArrow.style.borderTopRightRadius = "8px";
        this.downArrow.style.borderBottomRightRadius = "8px";
        this.upArrowIcon.setAttribute("style", "height:10px;width:12px;margin-left:10px");
        this.upArrowIcon.setAttribute("src", "./src/arrow.png");
        this.downArrowIcon.setAttribute("style", "height:10px;width:12px;transform:rotate(180deg);margin-left:10px");
        this.downArrowIcon.setAttribute("src", "./src/arrow.png");
        this.upArrow.addEventListener("click", () => {
            if (Number(this.value) + 1 <= this.max) {
                this.value++;
                this.setAttribute("value", this.value);
            }
        })
        this.downArrow.addEventListener("click", () => {
            if (Number(this.value) + 1 >= this.min) {
                this.value--;
                this.setAttribute("value", this.value);
            }
        })
        this.upArrow.appendChild(this.upArrowIcon);
        this.downArrow.appendChild(this.downArrowIcon);
        this.shadow.appendChild(this.backdrop);
        this.shadow.appendChild(this.upArrow);
        this.shadow.appendChild(this.downArrow);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "value" && newValue <= this.max && newValue >= this.min) {
            this.value = newValue;
            this.backdrop.innerText = newValue.toString();
            this.dispatchEvent(this.changed);
        }
        else if (name == "min") {
            this.min = newValue;
            if (this.value < newValue) { this.value = newValue }
        } else if (name == "max") {
            this.max = newValue;
            if (this.value > newValue) { this.value = newValue }
        }
    }
}

customElements.define("custom-range", CustomRange);

document.addEventListener("DOMContentLoaded", () => {

    let startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                startButton.style.animationName = "startClick1"; startButton.style.animationDuration = "350ms"; startButton.style.animationTimingFunction = "cubic-bezier(0, 0, 0.18, 1.82)";
                setTimeout(() => {
                    document.gameForm.submit();
                }, 300);
                break;
            case 1:
                startButton.style.animationName = "startClick2"; startButton.style.animationDuration = "750ms"; startButton.style.animationTimingFunction = "cubic-bezier(0,0,1,0)";
                setTimeout(() => {
                    document.gameForm.submit();
                }, 700);
                break;
            case 2:
                startButton.style.animationName = "startClick3"; startButton.style.animationDuration = "0.8s"; startButton.style.animationTimingFunction = "cubic-bezier(.75,0,0,1)";
                setTimeout(() => {
                    document.gameForm.submit();
                }, 750);
                break;
            case 3:
                startButton.style.animationName = "startClick4"; startButton.style.animationDuration = "0.8s"; startButton.style.animationTimingFunction = "cubic-bezier(.75,0,0,1)";
                setTimeout(() => {
                    document.gameForm.submit();
                }, 750);
                break;
            default:
                break;
        }

    });
    playingField = document.getElementById("playingField");
    xWidth = document.getElementById("xWidth");
    yWidth = document.getElementById("yWidth");
    bombs = document.getElementById("bombs");
    bombPercent();
    bombs.addEventListener("change", bombPercent);
    xWidth.addEventListener("change", bombPercent);
    yWidth.addEventListener("change", bombPercent);
});