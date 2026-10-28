
const quizData = {
    science: [
        { q: "Which planet is known as the Red Planet?", a: ["Earth", "Mars", "Venus", "Jupiter"], correct: 1 },
        { q: "Which gas do plants absorb?", a: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2 },
        { q: "What is the boiling point of water?", a: ["50°C", "100°C", "150°C", "200°C"], correct: 1 },
        { q: "Which organ pumps blood?", a: ["Lungs", "Brain", "Heart", "Kidney"], correct: 2 },
        { q: "What is the nearest star to Earth?", a: ["Sun", "Sirius", "Moon", "Mars"], correct: 0 }
    ],

    computer: [
        { q: "What does CPU stand for?", a: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Processing User"], correct: 0 },
        { q: "Which language is used to style webpages?", a: ["HTML", "CSS", "SQL", "Python"], correct: 1 },
        { q: "What does HTML stand for?", a: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Mark Language", "Home Text Markup Language"], correct: 0 },
        { q: "Which one is an input device?", a: ["Monitor", "Printer", "Keyboard", "Speaker"], correct: 2 },
        { q: "Which company developed Windows?", a: ["Apple", "Microsoft", "Google", "Intel"], correct: 1 }
    ],

    general: [
        { q: "What is the capital of India?", a: ["Mumbai", "Chennai", "New Delhi", "Kolkata"], correct: 2 },
        { q: "How many days are there in a week?", a: ["5", "6", "7", "8"], correct: 2 },
        { q: "Which is the largest ocean?", a: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
        { q: "What is the national animal of India?", a: ["Lion", "Tiger", "Elephant", "Deer"], correct: 1 },
        { q: "How many colours are in a rainbow?", a: ["5", "6", "7", "8"], correct: 2 }
    ],

    maths: [
        { q: "What is 5 + 7?", a: ["10", "11", "12", "13"], correct: 2 },
        { q: "What is 9 × 3?", a: ["18", "27", "21", "30"], correct: 1 },
        { q: "What is the square of 4?", a: ["8", "12", "16", "20"], correct: 2 },
        { q: "What is 100 divided by 4?", a: ["20", "25", "30", "40"], correct: 1 },
        { q: "How many sides does a triangle have?", a: ["2", "3", "4", "5"], correct: 1 }
    ]
};

let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 120;
let timerInterval;
let quizFinished = false;

// Shuffle questions for every quiz attempt
function shuffleQuestions(list) {
    let copy = [...list];

    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

// Start the quiz
function startQuiz() {
    let category = document.getElementById("category").value;

    questions = shuffleQuestions(quizData[category]);
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    timeLeft = 120;
    quizFinished = false;

    document.getElementById("home").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");

    document.getElementById("categoryName").innerText =
        "Category: " + document.getElementById("category").selectedOptions[0].text;

    showQuestion();

    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            submitQuiz();
        }
    }, 1000);
}

// Display a question and its options
function showQuestion() {
    let q = questions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        "Question " + (currentQuestion + 1) + " of " + questions.length;

    document.getElementById("question").innerText = q.q;

    let answerBox = document.getElementById("answers");
    answerBox.innerHTML = "";

    q.a.forEach(function(option, index) {
        let label = document.createElement("label");
        let radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "answer";
        radio.value = index;
        radio.checked = userAnswers[currentQuestion] === index;

        radio.addEventListener("change", function() {
            userAnswers[currentQuestion] = index;
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(" " + option));
        answerBox.appendChild(label);
    });
}

// Move to the previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

// Move to the next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    }
}

// Submit quiz and calculate the result
function submitQuiz() {
    if (quizFinished) return;

    quizFinished = true;
    clearInterval(timerInterval);

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedAnswers = 0;

    questions.forEach(function(q, index) {
        if (userAnswers[index] === null) {
            skippedAnswers++;
        } else if (userAnswers[index] === q.correct) {
            correctAnswers++;
        } else {
            wrongAnswers++;
        }
    });

    let percentage = Math.round(
        (correctAnswers / questions.length) * 100
    );

    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    document.getElementById("score").innerText =
        "Your Score: " + correctAnswers + " / " + questions.length;

    document.getElementById("percentage").innerText =
        "Percentage: " + percentage + "%";

    document.getElementById("correct").innerText =
        "Correct Answers: " + correctAnswers;

    document.getElementById("wrong").innerText =
        "Wrong Answers: " + wrongAnswers;

    document.getElementById("unanswered").innerText =
        "Unanswered Questions: " + skippedAnswers;

    if (percentage >= 80) {
        document.getElementById("message").innerText =
            "Excellent! Great job!";
    } else if (percentage >= 50) {
        document.getElementById("message").innerText =
            "Good work! Keep practising!";
    } else {
        document.getElementById("message").innerText =
            "Keep learning. You can do better!";
    }

    if (timeLeft <= 0) {
        document.getElementById("message").innerText +=
            " Time is over; quiz submitted automatically.";
    }
}
