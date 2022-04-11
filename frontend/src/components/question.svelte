<script>
    export let global_view = {}; 
    export let question_view = {}; 

    let answerChosenIndex = -1; 
    
    function answerQuestion(indexOfPicked) {
        console.log(question_view); 
        console.log(question_view.showAnswers); 
        if (!question_view.showAnswers) {
            answerChosenIndex = indexOfPicked; 
            question_view.questionAnswered = true; 
            question_view.playerAnswer = question_view.options[indexOfPicked]; 
            global_view.myPlayerCh.publish("player-answer", {
                answerText: question_view.playerAnswer
            }); 
        }
    }
</script>

<div class="game_question">
    <h2>{question_view.qText}</h2>
</div>

{#each question_view.options as option, i}
    <div class="game_answer"
        class:answer_selected="{answerChosenIndex === i}"
        class:wrong-answer="{(((question_view.options[i] === question_view.playerAnswer) 
                                || (question_view.playerAnswer == null))
                                    && (question_view.correctAnswer != question_view.playerAnswer) 
                                    && (question_view.showAnswers))}"
        class:correct-answer="{((question_view.options[i] === question_view.correctAnswer) 
                                    && (question_view.showAnswers))}"
        on:click="{() => answerQuestion(i)}"
    ><p>{question_view.options[i]}</p>
    </div>
{/each}

{#if question_view.showAnswers}
    <div class="timer">
        Show leaderboard in {question_view.leaderboardTimer}...
    </div>
{/if}

<style>
    .timer {
        text-align: center;
        font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
        font-size: 27px;
        margin-bottom: 10px;
    }

    .game_question {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-radius: auto;
        margin-bottom: 5px;
        justify-content: center;
        background-color: #799BF4;
        border-radius: 9px;
        color: white;
        width: 321px;
        height: 104px;
    }

    .game_answer {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-radius: auto;
        margin-bottom: 4px;
        border-radius: 9px;
        justify-content: center;
        background-color: #79c8f4;
        width: 321px;
    }

    .answer_selected {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-radius: auto;
        margin-bottom: 4px;
        border-radius: 9px;
        border-width: 5px; 
        border-style: solid;
        border-color: black;
        justify-content: center;
        background-color: #79c8f4;
        width: 321px;
    }

    .wrong-answer {
        background-color: #CA3433; 
    }

    .correct-answer {
        background-color: #8efd00; 
    }

    .results_button {
        margin-top: 3%;
        border-radius: 30px;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 1.2vw;
		text-align: center;
		background:#79C8F4;
		color: black;
		width: 10vw;
		height: 3vw;
		border: none;
		box-shadow: 2px 3px gray;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">