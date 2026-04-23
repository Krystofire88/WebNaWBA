let playingField = null;
let xWidth = null;
let yWidth = null;
let bombs = null;
let bgm = null;

function bombPercent() {
    bombs.max = xWidth.value * yWidth.value - 1;
    if (Number(bombs.value) > Number(bombs.max)) {
        bombs.setAttribute("value", bombs.max.toString());
    }
    document.getElementById("bomb%").innerHTML = "Density: " + (bombs.value / (xWidth.value * yWidth.value) * 100).toFixed(2) + "%";
}

class CustomPicker extends HTMLElement {
    static observedAttributes = ["color", "size", "value"];
    static songList = ["Caramella Girls - Caramelldansen","Muhamed Brkić Hamo - Bosanska Artiljerija",""];
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        this.backdrop = document.createElement("div");
        this.pickArrow = document.createElement("div");
        this.pickArrowIcon = document.createElement("img");
        this.listItem = document.createElement("div");
        this.stylepoop = document.createElement("style");
    }

    shadow = "";
    backdrop = "";
    pickArrow = "";
    pickArrowIcon = "";
    listItem = "";
    value = 0;
    state=1;
    stylepoop="";
    changed = new Event("change", { composed: true });

    connectedCallback() {

        this.stylepoop.textContent = `
      .hover {
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function:cubic-bezier(0, 0, 0.18, 1.82);
}
.hover:hover {
  transform: scale(1.1);
}
  .hover:active {
  transform:scaleY(0.8) scaleX(1);}
  .listItem {
  display: ${this.state ? "none" : "flex"};
  
  }
    `;
        this.shadow.appendChild(this.stylepoop);
        this.listItem.style.backgroundColor = "#F8F2DC";
        this.listItem.style.borderRadius = "8px";
        this.listItem.style.color = "#7E2828";
        this.listItem.style.fontFamily = "Inter";
        this.listItem.style.fontSize = "32px";
        this.listItem.style.letterSpacing = "5%";
        // this.listItem.style.borderStyle = "solid";
        // this.listItem.style.borderWidth = "4px";
        // this.listItem.style.borderColor = "indianred";
        this.listItem.style.width = "40vw";
        this.listItem.style.height = "64px";
        this.listItem.style.textAlign = "center";
        // this.listItem.style.display = this.state ? "none" : "flex";
        this.listItem.style.justifyContent = "center";
        this.listItem.style.alignItems = "center";
        this.listItem.style.filter = "drop-shadow(0 7px 5px rgba(0,0,0,0.5))";
        this.listItem.classList.add("listItem");
        this.listItem.classList.add("hover");

        this.backdrop.style.backgroundColor = "#F8F2DC";
        this.backdrop.style.borderTopLeftRadius = "8px";
        this.backdrop.style.borderBottomLeftRadius = "8px";
        this.backdrop.style.color = "#000000";
        this.backdrop.style.fontFamily = "Inter";
        this.backdrop.style.fontSize = "32px";
        this.backdrop.innerText = "Select song...";
        this.backdrop.style.width = "40vw";
        this.backdrop.style.height = "64px";
        this.backdrop.style.textAlign = "center";
        this.backdrop.style.display = "flex";
        this.backdrop.style.justifyContent = "center";
        this.backdrop.style.alignItems = "center";
        this.pickArrow.style.backgroundColor = "#7E2828";
        this.pickArrow.style.width = "64px";
        this.pickArrow.style.height = "64px";
        this.pickArrow.style.position = "absolute";
        this.pickArrow.style.marginTop = "-64px";
        this.pickArrow.style.marginLeft = "39vw";
        this.pickArrow.style.display = "flex";
        this.pickArrow.style.justifyItems = "center";
        this.pickArrow.style.alignItems = "center";
        this.pickArrow.style.borderTopRightRadius = "8px";
        this.pickArrow.style.borderBottomRightRadius = "8px";
        this.pickArrow.classList.add("hover");
        this.pickArrowIcon.setAttribute("style", `height:16px;width:20px;transform:rotate(${(180*this.state).toString()}deg);margin-left:22px`);
        this.pickArrowIcon.setAttribute("src", "./src/arrow.png");
        this.pickArrow.addEventListener("click", () => {
            this.state ^= 1;
            this.pickArrowIcon.style.transform=`rotate(${(180*this.state).toString()}deg)`;
                
            this.stylepoop.textContent = `
      .hover {
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function:cubic-bezier(0, 0, 0.18, 1.82);
}
.hover:hover {
  transform: scale(1.1);
}
  .hover:active {
  transform:scaleY(0.8) scaleX(1);}
  .listItem {
  display: ${this.state ? "none" : "flex"};
  
  }
    `;
        })
        this.pickArrow.appendChild(this.pickArrowIcon);
        this.shadow.appendChild(this.backdrop);
        this.shadow.appendChild(this.pickArrow);
        for (let i = 0; i < CustomPicker.songList.length; i++) {
            const x = this.listItem.cloneNode(true);
            x.innerText=CustomPicker.songList[i];
            x.addEventListener("click",()=>{
            this.backdrop.innerText=x.innerText;this.setAttribute("value",i);
        })
            this.shadow.appendChild(x);
        }
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "value") {
            this.value = newValue;
            this.backdrop.innerText = CustomPicker.songList[newValue];
            this.dispatchEvent(this.changed);
        }
    }
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
        const style = document.createElement("style");

        style.textContent = `
      .hover {
  transition-property: all;
  transition-duration: 200ms;
  transition-timing-function:cubic-bezier(0, 0, 0.18, 1.82);
}
.hover:hover {
  transform: scale(1.1);
}
  .hover:active {
  transform:scale(0.8);
  }
    `;

        this.shadow.appendChild(style);
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
        this.upArrow.classList.add("hover");
        this.downArrow.classList.add("hover");
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
customElements.define("custom-picker", CustomPicker);

document.addEventListener("DOMContentLoaded", () => {

    let startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                startButton.style.animationName = "startClick1"; startButton.style.animationDuration = "350ms"; startButton.style.animationTimingFunction = "cubic-bezier(0, 0, 0.18, 1.82)";
                setTimeout(() => {
                    window.location.href=`/minefield.html?bombs=${bombs.value}&yWidth=${yWidth.value}&xWidth=${xWidth.value}&bgm=${bgm.value}`;
                }, 300);
                break;
            case 1:
                startButton.style.animationName = "startClick2"; startButton.style.animationDuration = "750ms"; startButton.style.animationTimingFunction = "cubic-bezier(0,0,1,0)";
                setTimeout(() => {
                    window.location.href=`/minefield.html?bombs=${bombs.value}&yWidth=${yWidth.value}&xWidth=${xWidth.value}&bgm=${bgm.value}`;
                }, 700);
                break;
            case 2:
                startButton.style.animationName = "startClick3"; startButton.style.animationDuration = "0.8s"; startButton.style.animationTimingFunction = "cubic-bezier(.75,0,0,1)";
                setTimeout(() => {
                    window.location.href=`/minefield.html?bombs=${bombs.value}&yWidth=${yWidth.value}&xWidth=${xWidth.value}&bgm=${bgm.value}`;
                }, 750);
                break;
            case 3:
                startButton.style.animationName = "startClick4"; startButton.style.animationDuration = "0.8s"; startButton.style.animationTimingFunction = "cubic-bezier(.75,0,0,1)";
                setTimeout(() => {
                    window.location.href=`/minefield.html?bombs=${bombs.value}&yWidth=${yWidth.value}&xWidth=${xWidth.value}&bgm=${bgm.value}`;
                }, 750);
                break;
            default:
                window.location.href=`/minefield.html?bombs=${bombs.value}&yWidth=${yWidth.value}&xWidth=${xWidth.value}&bgm=${bgm.value}`;
                break;
        }

    });
    playingField = document.getElementById("playingField");
    xWidth = document.getElementById("xWidth");
    yWidth = document.getElementById("yWidth");
    bombs = document.getElementById("bombs");
    bgm = document.getElementById("bgm");
    bombPercent();
    bombs.addEventListener("change", bombPercent);
    xWidth.addEventListener("change", bombPercent);
    yWidth.addEventListener("change", bombPercent);
});