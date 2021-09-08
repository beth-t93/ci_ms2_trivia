const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: 'Inside which HTML element do we put the JavaScript??',
        choice1: '<script>',
        choice2: '<javascript>',
        choice3: '<js>',
        choice4: '<scripting>',
        answer: 1,
    },
    {
        question:
            "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choice1: "<script href='xxx.js'>",
        choice2: "<script name='xxx.js'>",
        choice3: "<script src='xxx.js'>",
        choice4: "<script file='xxx.js'>",
        answer: 3,
    },
    {
        question: " How do you write 'Hello World' in an alert box?",
        choice1: "msgBox('Hello World');",
        choice2: "alertBox('Hello World');",
        choice3: "msg('Hello World');",
        choice4: "alert('Hello World');",
        answer: 4,
    },
];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};


getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //go to the end page
        return window.location.assign('/score.html');
    }

    questionCounter++; //adds 1 onto question counter
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1); //Will remove the used question from the available Questions list
    acceptingAnswers = true;

};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        let selectedChoice = e.target;
        let selecetedAnswer = selectedChoice.dataset["number"];

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

        //const classToApply =
          //  selecetedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; //will apply class to answer whether incorrect or correct

       // selectedChoice.parentElement.classList.add('classToApply');
        //selectedChoice.parentElement.classList.remove('classToApply');
        
        getNewQuestion();
    });
});

startGame();