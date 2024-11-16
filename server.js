const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// משרת את כל הקבצים הסטטיים מתיקיית client
app.use(express.static('public'));
app.use(express.json());

const questionsFile = path.join(__dirname, 'questions.json');
const answersFile = path.join(__dirname,  'answers.json');

// דף הבית - index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API לשליפת שאלות
app.get('/api/questions', (req, res) => {
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
    res.json(questions);
});

// API להוספת שאלה חדשה
app.post('/api/add-question', (req, res) => {
    const { question, options, correctAnswer } = req.body;
    const questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
    questions.push({ question, options, correctAnswer });
    fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
    res.sendStatus(201);
});

// API לשליחת תשובות משתמשים
app.post('/api/submit', (req, res) => {
    const { username, score, answers } = req.body;
    const entries = JSON.parse(fs.readFileSync(answersFile, 'utf8'));
    entries.push({ username, score, answers });
    fs.writeFileSync(answersFile, JSON.stringify(entries, null, 2));
    res.sendStatus(201);
});

// API לשליפת תשובות שנשלחו
app.get('/api/answers', (req, res) => {
    const entries = JSON.parse(fs.readFileSync(answersFile, 'utf8'));
    res.json(entries);
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
