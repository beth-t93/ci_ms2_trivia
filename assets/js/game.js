const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const loader = document.getElementsByClassName('loadingWheel');
const game = document.getElementById('gameArea');
const questionNumberArea = document.getElementById('progress-number');


const scoreText = document.getElementById("score");

const maxQuestions = 25;

let currentQuestion = {};
let acceptingAnswers = false;
let scoreTitle = 0;
let questionNumber = 0;
let availableQuestions = [];

let questions = [];

// Fetch and Catch to pull data from API into the DOM
getData = () => {
    fetch(
        "https://opentdb.com/api.php?amount=25&category=9&difficulty=hard&type=multiple"
    )
        .then((res) => {
            return res.json();
        })
        .then((loadedQuestions) => {
            questions = loadedQuestions.results.map((loadedQuestion) => {
                const formattedQuestion = {
                    question: loadedQuestion.question,
                };
    
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
                answerChoices.splice(
                    formattedQuestion.answer - 1,
                    0,
                    loadedQuestion.correct_answer
                );
    
                answerChoices.forEach((choice, index) => {
                    formattedQuestion['choice' + (index + 1)] = choice;
                });
    
                return formattedQuestion;
            });
            startGame();
        })
        .catch((err) => {
            console.error(err);
        });
}

getData();


// Starts the game
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hide');
    loader.classList.add('hide');
  };

// Pulls a new question and increases question number
getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= maxQuestions) {
        localStorage.setItem("mostRecentScore", score);
        //go to score area
        game.classList.add("hide");
        // showScore.classList.remove("hide");
        //finalScore.innerHTML = (`Congratulations you scored ${score}`);
    } else {
        questionNumber++;
        // questionCounterText.innerText = `${questionCounter}`;

        const questionIndex = Math.floor(Math.random() * availableQuesions.length);
        currentQuestion = availableQuesions[questionIndex];
        question.innerText = currentQuestion.question;

        choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
        });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
    }

};


// listens for answers and gives feedback if correct or incorrect
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        let selectedChoice = e.target;
        let selecetedAnswer = selectedChoice.dataset["number"];

        // Sweet Alert Modals for user feedback from https://sweetalert2.github.io/#examples
        if (selecetedAnswer == currentQuestion.answer) {
            Swal.fire({
                icon: 'success',
                title: 'Thats the right answer!',
                showConfirmButton: false,
                timer: 2000
                
              });
              selectedChoice.parentElement.classList.add('correct');
              scoreTitle++;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops... that is not the right answer!',
                showConfirmButton: false,
                timer: 2000
              });
              selectedChoice.parentElement.classList.add('incorrect');

        } 
        
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
          }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreTitle.innerText = score
};

startGame();