document.addEventListener('DOMContentLoaded', loadQuestions);

let questions = [];
let userAnswers = [];

function loadQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuiz();
        })
        .catch(error => console.error('Error loading questions:', error));
}

function displayQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // נקה תוכן קודם

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-block';

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionTitle);

        q.options.forEach((option, optionIndex) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `question-${index}`;
            radio.value = optionIndex;
            radio.addEventListener('change', () => saveAnswer(index, optionIndex)); // שמירת תשובה בעת שינוי

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement('br'));
        });

        quizContainer.appendChild(questionDiv);
    });
}

// שמירת תשובות המשתמש במערך
function saveAnswer(questionIndex, selectedOption) {
    userAnswers[questionIndex] = selectedOption;
}

function submitQuiz() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert('Please enter your name');
        return;
    }

    let correctAnswersCount = 0;

    // בדיקת התשובות והוספת ניקוד
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer !== undefined && userAnswer === q.correctAnswer) {
            correctAnswersCount++;
        }
    });

    // חישוב הניקוד לפי אחוזים
    const score = (correctAnswersCount / questions.length) * 100;

    // הצגת תוצאה למשתמש
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `${username}, Your Score: ${score.toFixed(2)}% (${correctAnswersCount} correct answers out of ${questions.length})`;

    // שליחת התוצאה לשרת
    fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score, answers: userAnswers })
    })
        .then(() => alert('Your answers have been submitted!'))
        .catch(error => console.error('Error submitting quiz:', error));
}
