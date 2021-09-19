const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const loader = document.getElementById('loader');
const game = document.getElementById('gameArea');
const questionNumberArea = document.getElementById('progress-number');
const scoreArea = document.getElementById('scoreArea');
const finalScore = document.getElementById('finalScore');
const maxQuestions = 15;

let questionCounter = 0;
let currentQuestion = {};
let acceptingAnswers = false;
let questionNumber = 0;

// Fetch and Catch to pull data from API into the DOM
getData = () => {
    loadingWheel(true);
    fetch(
        "https://opentdb.com/api.php?amount=15&category=&difficulty=medium&type=multiple"
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
            loadingWheel(false);
            game.classList.remove('hide');
            startGame();
            
        })
        .catch((err) => {
            console.error(err);
        });
};

getData();

// Starts the game
startGame = () => {
    score = 0;
    availableQuesions = [...questions];
    questionNumberArea.innerHTML = `${questionNumber}`;
    getNewQuestion();
  };

// Pulls a new question and increases question number
getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= maxQuestions) {
        localStorage.setItem("mostRecentScore", score);
        //go to score area
        game.classList.add("hide");
        scoreArea.classList.remove("hide");
        finalScore.innerText = (`${score} / ${maxQuestions}`);
    } else {
        scoreArea.classList.add('hide');
        questionNumber++;
        questionNumberArea.innerHTML = `${questionNumber}`;

        const questionIndex = Math.floor(Math.random() * availableQuesions.length);
        currentQuestion = availableQuesions[questionIndex];
        question.innerHTML = currentQuestion.question;

        choices.forEach(choice => {
        const number = choice.dataset.number;
        choice.innerHTML = currentQuestion["choice" + number];
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
        let selecetedAnswer = selectedChoice.dataset.number;

        // Sweet Alert Modals for user feedback from https://sweetalert2.github.io/#examples
        if (selecetedAnswer == currentQuestion.answer) {
            Swal.fire({
                icon: 'success',
                title: `Thats the right answer!`,
                showConfirmButton: false,
                timer: 3500
                
              });
              selectedChoice.parentElement.classList.add('correct');
              score++;
        } else {
            Swal.fire({
                icon: 'error',
                title: `Oops... that is not the right answer! The correct answer was number ${currentQuestion.answer}`,
                showConfirmButton: false,
                timer: 3500
              });
              selectedChoice.parentElement.classList.add('incorrect');

        } 
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove('correct');
            selectedChoice.parentElement.classList.remove('incorrect');
            getNewQuestion();
          }, 3500);
    });
});

// Increase quiz score for each correct answer
incrementScore = num => {
    score += num;
    finalScore.innerText = score;
};

// Shows and hides the loading wheel
function loadingWheel(loading) {
    if (loading) {
        loader.classList.remove("hide"); 
    } else {
        loader.classList.add("hide");
    }
}

