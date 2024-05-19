var gameActive = false;

var gameMode = "color";
var correctClass = "triangle";
var game_block = document.getElementById('game_board');
var gameActive = false;
var usersScore = new Map();
var currentUser = null;
var defaultRoundTime = 10000;
var currentRoundTime = defaultRoundTime;
var currentRoundsCount = 0;
var basePoint = 2;
var current_timer = null;
var current_number = 1;
var current_correct_elements = [0,0,0,0,0,0,0,0,0];
var settings = {
    number: {basePoint: 4,
        defaultRoundTime: 50000, 
    },
    color: {basePoint: 2,
        defaultRoundTime: 12000, 
    },
    figure: {basePoint: 1,
        defaultRoundTime: 10000, 
    }
}


// Функция для проверки, нажаты ли все элементы с классом "correct"
function checkCompletion() {
    if (gameMode == "number") {

        if (current_number == 10) {
            return true;
        }
        return false;
    }
    
    var correctElements = document.querySelectorAll("." + gameMode + correctClass);
    var allCorrect = true;
    correctElements.forEach(function(element) {
        if (!element.classList.contains('clicked')) {
            allCorrect = false;
        }
    });
    return allCorrect;
}

function show_correct_item_hide() {
    document.getElementById('correct-item').style.visibility = "visible";
    if (gameMode == "figure") {
        document.getElementById('correct-item').innerHTML = '<h3>Нужно нажать на все фигруры такой формы</h3>';
        correctClass = figures[Math.floor(Math.random()*figures.length)];
        let htmlString = figuresPath[correctClass].replaceAll("$$$$", "").replaceAll("####", "#FFCFEE");
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        document.getElementById('correct-item').appendChild(div);
    }
    if (gameMode == "colors") {
        document.getElementById('correct-item').innerHTML = '<h3>Нужно нажать на все фигруры такого цвета</h3>';
        correctClass = colors[Math.floor(Math.random()*figures.length)];
        let htmlString = figuresPath["square"].replaceAll("$$$$", "").replaceAll("####", "#" + correctClass);
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        document.getElementById('correct-item').appendChild(div);
    }
    if (gameMode == "number") {
        document.getElementById('correct-item').innerHTML = '<h3>Нужно нажимать цифры по неубыванию</h3>';
    }
}
function check_number_clicked_correct(clickedElement) {
    if (gameMode == "number") {
        let correctElements = document.querySelectorAll("." + gameMode + current_number.toString());
        while (correctElements.length - current_correct_elements[current_number] == 0) {
            current_number++; 
            correctElements = document.querySelectorAll("." + gameMode + current_number.toString());     
        }
        if (clickedElement.classList.contains(gameMode + current_number.toString())) {
            current_correct_elements[current_number]++;
            return true;
        }
        return false;
    }
}
// Функция для обработки кликов на элементах SVG
function handleSVGClick(event) {
    if (gameActive) {
        var clickedElement = event.target;
        clickedElement.classList.add('clicked');
        if (gameMode == "number") {
            if (check_number_clicked_correct(clickedElement)) {
                if (checkCompletion()) {
                    alert('Следующий раунд');
                    currentRoundsCount++;
                    show_correct_item_hide();
                    startRound();
                    currentRoundTime = defaultRoundTime - currentRoundsCount*500
                    if (currentRoundTime < defaultRoundTime / 2) {
                        console.log(currentRoundsCount);
                        alert("Вы прошли уровень");

                        localStorage.setItem(currentUser, Math.max(localStorage.getItem(currentUser), currentRoundsCount*basePoint));
                        currentRoundsCount = 0;
                        resetGame();
                    }
                }
            } else {
                alert('Игра завершена! Вы нажали на неверный элемент. Ваш результат'  + currentRoundsCount*basePoint);
                localStorage.setItem(currentUser, Math.max(localStorage.getItem(currentUser), currentRoundsCount*basePoint));
                currentRoundsCount = 0;
                resetGame();
            }
            return;
        }
        if (clickedElement.classList.contains(gameMode + correctClass)) {
            if (checkCompletion()) {
                alert('Следующий раунд');
                currentRoundsCount++;
                show_correct_item_hide();
                startRound();
                currentRoundTime = defaultRoundTime - currentRoundsCount*500;
                if (currentRoundTime < defaultRoundTime / 2) {
                    alert("Вы прошли уровень");
                    localStorage.setItem(currentUser, Math.max(localStorage.getItem(currentUser), currentRoundsCount*basePoint));
                    currentRoundsCount = 0;
                    resetGame();
                }
            }
        } else {
            alert('Игра завершена! Вы нажали на неверный элемент. Ваш результат '  + currentRoundsCount*basePoint);
            localStorage.setItem(currentUser, Math.max(localStorage.getItem(currentUser), currentRoundsCount*basePoint));
            currentRoundsCount = 0;
            resetGame();
        }
    }
}
function resetGame() {
    if (gameMode == "number") {
        basePoint = settings.number.basePoint;
        defaultRoundTime = settings.number.basePoint;
    }
    if (gameMode == "color") {
        basePoint = settings.color.basePoint;
        defaultRoundTime = settings.color.basePoint
    }
    if (gameMode == "figure") {
        basePoint = settings.figure.basePoint;
        defaultRoundTime = settings.figure.basePoint
    }
    current_number = 1;
    current_correct_elements = [0,0,0,0,0,0,0,0,0];
    document.getElementById('correct-item').style.visibility = "hidden";
    document.getElementById("correct-item").style.height = "0";
    gameActive = false;
    game_div.innerHTML = '';
    var svgElements = document.querySelectorAll('svg');
    svgElements.forEach(function(element) {
        element.removeEventListener('click', handleSVGClick);
    });
    while ( game_div.firstChild ) game_div.removeChild( game_div.firstChild );
    document.getElementById("auth_div").style.visibility = "visible";
    document.getElementById("auth_div").style.height = "auto";
}

function startTimer() {
    if (current_timer != null) {
        clearTimeout(current_timer)
    }
    gameActive = true;
    current_timer = setTimeout(function() {
        if (!checkCompletion()) {
            alert('Игра завершена! Время истекло. Ваш результат ' + currentRoundsCount*basePoint);
            localStorage.setItem(currentUser, Math.max(localStorage.getItem(currentUser), currentRoundsCount*basePoint));
            currentRoundsCount = 0;
            resetGame();
        }
    }, currentRoundTime);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function auth_user() {
    console.log(getCookie("current_user"));
    let username = document.getElementById('name_input').value;
    if (username === "") {
        alert("Введите имя пользователя, иначе играть нельзя.");
        return false;
    }
    currentUser = username;
    if (!isNaN(localStorage.getItem(username)) || localStorage.getItem(username) != 0) {
        localStorage.setItem(username, Math.max(localStorage.getItem(username), 0));
    }
    else {
        localStorage.setItem(username, 0);
    }
    return true;
}

function startRound() {
    resetGame();
    document.getElementById('correct-item').style.visibility = "visible";
    document.getElementById('correct-item').style.height = "auto";
    fillGameBoard();
    startTimer();
    document.getElementById("auth_div").style.visibility = "hidden";
    document.getElementById("auth_div").style.height = "0";
    var svgElements = document.querySelectorAll('.game_item');
    svgElements.forEach(function(element) {
        element.addEventListener('click', handleSVGClick);
    });
}
