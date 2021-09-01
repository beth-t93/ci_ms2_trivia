const question = document.getElementById("question");

let questionCount = 0;


/** Retrieves API data */
fetch ('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
    .then((res) => {
        return res.json
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) +1;
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
        startGame()
    })
    .catch((err) => {
        console.error(err);
    });


/** Starts the quiz */
function startGame() {
    totalQuestions = [...questions];
    score = 0;
    questionCount = 0
    newQuestion();
    Gamepad.classlist.remove("hide");
}

function newQuestion() {

}