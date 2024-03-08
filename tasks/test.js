let questions = [
    {
        text: "Если человека назвали мордофиля, то это…",
        explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется," +
            " что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный.",
        answers: [
            {text: "Значит, что он тщеславный.", correct: true},
            {text: "Значит, что у него лицо как у хряка.", correct: false},
            {text: "Значит, что чумазый.", correct: false}
        ]
    },
    {
        text: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека." +
            " А еще так называют прыщи.",
        answers: [
            {text: "Он маленький и невзрачный.", correct: true},
            {text: "Он тот еще алкоголик.", correct: false},
            {text: "Он не держит свое слово.", correct: false}
        ]
    },
    {
        text: "Если человека прозвали пятигузом, значит, он…",
        explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера," +
            " пятигуз — это ненадежный, непостоянный человек.",
        answers: [
            {text: "Не держит слово.", correct: true},
            {text: "Изменяет жене.", correct: false},
            {text: "Без гроша в кармане.", correct: false}
        ]
    },
    {
        text: "Кто такой шлындра?",
        explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться.",
        answers: [
            {text: "Обманщик.", correct: false},
            {text: "Нытик.", correct: false},
            {text: "Бродяга.", correct: true}
        ]
    }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const listQuestion = document.getElementById("list");
const resultContainer = document.querySelector(".result");
const stats = document.getElementById("stats");
let currentQuestionIndex = 0;
let correctAnswers = 0;
resultContainer.style.visibility = 'hidden';
shuffleArray(questions);



function answerClickHandler(questionIndex, answerIndex) {
    let answersList = document.getElementById(`answers-${questionIndex}`);
    removeAnswerList(answersList);
    setTimeout(function() {
        markQuestion(questionIndex, questions[questionIndex]["answers"][answerIndex]["correct"]);
        showQuestion(questions, ++questionIndex);
    }, 1000);

}
function showExplain(index) {
    if (document.getElementById(`question-${index}`).children.length > 1) {
        return
    }
    let explain = document.createElement("div");
    explain.classList.add("explain");
    explain.innerText = questions[index]["explanation"];
    document.getElementById(`question-${index}`).appendChild(explain);
}
function markQuestion(questionIndex, marker) {
    let question = document.getElementById(`question-${questionIndex}`);
    if (marker){
        question.children[0].style.backgroundColor = "#D3FFCE";
        correctAnswers++;
        question.children[0].addEventListener(
            "click", function () {
                showExplain(questionIndex);
            }
        )
    }
    else {
        question.children[0].style.backgroundColor = "#ff7373";
    }

}
function removeAnswerList(answersList) {
    answersList.style.transition = "transform 2s, opacity 2s";
    answersList.style.transform = "translateY(2000%)";
    setTimeout(function() {
        answersList.remove();
    }, 1000);
}
function checkAnswer(questionIndex, answerIndex) {
    return !!questions[questionIndex]["answers"][answerIndex].correct;
}

function showQuestion(questions, index) {
    if (index === questions.length) {
        showStats()
        return
    }
    let questionElement = document.createElement("div");
    questionElement.id = `question-${index}`;
    questionElement.classList.add("question")
    let questionBlock = document.createElement("div");
    questionBlock.classList.add("questionBlock");
    questionBlock.innerText = questions[index]["text"];
    questionElement.appendChild(questionBlock);
    let answersList = document.createElement("div");
    answersList.id = `answers-${index}`;
    listQuestion.appendChild(questionElement);
    questionElement.appendChild(answersList);
    for (let answer in questions[index]["answers"]) {
        let answerElement = document.createElement("div");
        answerElement.id = `answer-${answer}`;
        answerElement.classList.add("answerBlock");
        answerElement.innerText = questions[index]["answers"][answer]["text"];
        answerElement.addEventListener(
            "click", function () {
                answerClickHandler(index, answer);
            }
        )
        answersList.appendChild(answerElement);
    }
}

function showStats() {
    resultContainer.style.visibility = "visible";
    stats.innerText = `${correctAnswers}/${questions.length}`;
}
showQuestion(questions, currentQuestionIndex)