let inputForm = document.getElementById("text");
let submitButton = document.getElementById("submit")
let words_dict = new Map();
let number_dict = new Map();
let clicks = new Map();
let clickArea = document.getElementById("clickCounter");
clickArea.style.visibility = 'hidden'
submitButton.addEventListener(
    'click', (event) => {
        refresh()
        splitString(inputForm.value);
        fillContainer();
    }
)

// лес-бочка-20-бык-крик-3
function isNumber(value) {
    if (typeof value != "string") return false // we only process strings!
    return !isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(value)) // ...and ensure strings of whitespace fail
}

function compareNumbers(a, b) {
    return a - b;
}

function refresh() {
    const side = document.getElementById("side");
    side.innerHTML = '';
    const upper = document.getElementById("upper");
    upper.innerHTML = '';
    let textArea = document.getElementById("textArea");
    textArea.innerText = '';
    clickArea.style.visibility = 'hidden'
    clickArea.innerHTML = '';
    clicks = new Map();
    number_dict = new Map();
    words_dict = new Map();
}

function splitString(string) {
    let rawArray = string.split('-');
    let words_array = [];
    let number_array = [];
    for (let i = 0; i < rawArray.length; i++) {
        if (isNumber(rawArray[i])) {
            number_array.push(Number(rawArray[i]));
        } else {
            words_array.push(rawArray[i]);
        }
    }
    words_array.sort();
    number_array.sort(compareNumbers);
    for (let j = 0; j < words_array.length; j++) {
        words_dict.set("a" + (j + 1), words_array[j]);
    }
    for (let j = 0; j < number_array.length; j++) {
        number_dict.set("n" + (j + 1), number_array[j]);
    }
}

function fillContainer() {
    for (let [key, value] of words_dict) {
        let block = document.createElement("div");
        block.classList.add("block");
        block.id = `block-string-${key}`;
        block.innerText = `${key} ${value}`;
        block.draggable = true;
        block.ondragstart = drag;
        let side = document.getElementById("side");
        side.appendChild(block);
    }

    for (let [key, value] of number_dict) {
        let block = document.createElement("div");
        block.classList.add("block");
        block.id = `block-number-${key}`;
        block.innerText = `${key} ${value}`;
        block.draggable = true;
        block.ondragstart = drag;
        let side = document.getElementById("side");
        side.appendChild(block);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    draggedElement.style.display = "inline-block";
    if (event.target.classList.contains('block')) {
        var parent = event.target.parentNode;
        parent.insertBefore(draggedElement, event.target);
    } else if (event.target.classList.contains('upper-menu')) {
        event.target.appendChild(draggedElement);
    }
    let upperMenu = document.getElementById("upper");
    let resultString = ""
    for (let i = 0; i < upperMenu.children.length; i++) {
        if (upperMenu.children[i].id.includes("string")) {
            resultString += upperMenu.children[i].innerText.split(" ")[1];
            resultString += ' ';
        }

    }
    let textArea = document.getElementById("textArea");
    textArea.innerText = resultString;
    draggedElement.addEventListener("click", function (text) {
        if (clicks.get(draggedElement.innerText) === undefined) {
            clicks.set(draggedElement.innerText, 1);
        } else {
            clicks.set(draggedElement.innerText, (Number(clicks.get(draggedElement.innerText))) + 1);
        }
        clickCounterShow();
        console.log(clicks)
    })
}

function clickCounterShow() {
    clickArea.style.visibility = 'visible'
    clickArea.innerText = "Нажали ";
    for (let [key, value] of clicks) {
        clickArea.innerText += ` ${value} раз на элемент "${key}" и `

    }
    clickArea.innerText = ` ${clickArea.innerText .substring(0, clickArea.innerText .length - 2)}`;
}

document.addEventListener('dragover', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('block') || event.target.classList.contains('upper-menu')) {
        event.dataTransfer.dropEffect = 'move';
    } else {
        event.dataTransfer.dropEffect = 'none';
    }
});