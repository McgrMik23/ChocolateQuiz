// script.js

let curQues = 0; // Keeps track of which question program is on
let persTypeCount = {  // Count of question answers
    'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0
}

// Constants to work with index.html
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const resultText = document.getElementById('result');
const restartButton = document.getElementById('restart-button');

// Event listeners
startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', startQuiz);

function startQuiz() {
    // Reset variables
    curQues = 0;
    persTypeCount = {  
        'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0
    }
    startScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    questionScreen.style.display = 'block';
    showQuestion(questionData[curQues]);
}

function showQuestion(question) {
    questionText.textContent = question.question;
    answerButtons.innerHTML = '';
    for (let option in question.options) {
        const button = document.createElement('button');
        button.textContent = question.options[option];
        button.addEventListener('click', () => selectAnswer(option, question.type));
        answerButtons.appendChild(button);
    }
}

function selectAnswer(answer, questionType) {
    updateScores(questionType, answer);
    curQues++;

    if (curQues < questionData.length) {
        showQuestion(questionData[curQues]);
    } else {
        showResult();
    }
}

function updateScores(questionType, answer) {
    const odd = ['a', 'c'].includes(answer); // Is true if the answer is either a or c, false otherwise
    if (questionType === 'EI') {
        persTypeCount[odd ? 'E' : 'I']++; // Adds plus one to E if odd is true and I if false
    } else if (questionType === 'SN') {
        persTypeCount[odd ? 'S' : 'N']++;
    } else if (questionType === 'TF') {
        persTypeCount[odd ? 'T' : 'F']++;
    } else if (questionType === 'JP') {
        persTypeCount[odd ? 'J' : 'P']++;
    }
}

function determineChoconality() {
    return (persTypeCount['E'] > persTypeCount['I'] ? 'E' : 'I') +
           (persTypeCount['S'] > persTypeCount['N'] ? 'S' : 'N') +
           (persTypeCount['T'] > persTypeCount['F'] ? 'T' : 'F') +
           (persTypeCount['J'] > persTypeCount['P'] ? 'J' : 'P');
}

function getChoconality(chocoType) {
    return choconalities[chocoType];
}

function showResult() {
    questionScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    const chocoType = determineChoconality();
    const chocolateType = getChoconality(chocoType);
    
    resultText.textContent = `Your chocolate personality type is ${chocoType}. You are ${chocolateType}!`;
    
    // Send data to the backend
    fetch('http://localhost:8000/save-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result: chocolateType, chocoType: chocoType }),
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('status').innerText = data;
    })
    .catch(error => {
        document.getElementById('status').innerText = 'Error: ' + error;
    });
}