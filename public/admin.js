function addQuestion() {
    const question = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
    ];
    const correctAnswer = parseInt(document.getElementById('correctAnswer').value);

    fetch('/api/add-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options, correctAnswer })
    }).then(() => alert('Question Added'));
}

fetch('/api/answers')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('answers-container');
        data.forEach(entry => {
            container.innerHTML += `<p>${entry.username}: Score ${entry.score}, Answers: ${JSON.stringify(entry.answers)}</p>`;
        });
    });
