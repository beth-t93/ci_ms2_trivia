const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const game = document.getElementById('gameArea');
const scoreCount = document.getElementById('scoreArea');
const questionNumber = document.getElementById('progress-heading');
const quantChoice  = document.getElementById('numberSelect');
const catChoice = document.getElementById('categoryList');
const categorySubmit = document.getElementById('categorySubmit')

let answers = Array.from(document.getElementsByClassName("categorySubmit"));
let baseURL = "https://opentdb.com/";
let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter = 0;
let availableQuestions = [];



function loadingWheel(loading) {
    if (loading) {
        load.classList.remove("hide");
    } else {
        load.classList.add("hide");
    }
}

// Pulls API Data
function getData(gameTrigger) {
    if (gameTrigger) {
        dataUrl = (`${baseURL}api.php?amount=${quant}&category=${id}&difficulty=${diff}&type=multiple`);
    } else {
        dataUrl = (`${baseURL}api_category.php`);
    }
}

//Retrieves category list
function categoryChoice() {
    loadingWheel(true);
    getData(false);
    fetch(dataUrl)
        .then(response => response.json())
        .then(category => {
            let categoryList = category.trivia_categories;
            categoryList.forEach(category => {

                let categoryOption = document.createElement("option");
                let categoryTitle = document.createElement("p");
                let name = document.createTextNode(category.name);

                categoryTitle.appendChild(name);
                categoryOption.appendChild(categoryName);
                categoryOption.id = category.id;
                categoryOption.classList.add("category");
                document.getElementById("categoryList").appendChild(categoryOption);
            });
            loadingWheel(false);
            start.classList.remove("hide");
        })
        .catch(() => console.error());
}

categoryChoice();


//Retrives and organises data to pass to DOM
function getQuiz() {
    loadingWheel(true);
    getData(true);
    fetch(dataUrl)
        .then(data => data.json())

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
            if (questions.length > 0) {
                startGame();
            } else {
                errorRestart();
            }

        })
        .catch((err) => {
            console.error(err);
            errorRestart();
        });

}

//Starts the game
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove("hide");
}

//Gets new question
getNewQuestion = () => {
    if(availableQuestions.length == 0) {
        game.classList.add("hide");
        showScore.classList.remove("hide");
        finalScore.innerHTML = (`You Scored: ${score}!`);
    } else {
        questionCount++;
        questionNumber.innerText = (`Question: ${questionCount}`);
        
        const questionIndex = Math.floor(Math.random() * availableQuesions.length);
        currentQuestion = availableQuesions[questionIndex];
        question.innerText = currentQuestion.question;

        choices.forEach(choice => {
            const number = choice.dataset["number"];
            choice.innerText = currentQuestion["choice" + number];
        });

        availableQuestions.splice(questionIndex, 1); //Will remove the used question from the available Questions list
        acceptingAnswers = true;
    }
}

//Answer selection
function answerSelection() {
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
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
                score++;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... that is not the right answer!',
                    showConfirmButton: false,
                    timer: 2000
                  });
            }
            setTimeout(() => {
                getNewQuestion
            }, 2500);         
            
        });
    });
}
