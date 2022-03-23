<script>
    import { goto } from "$app/navigation";

    var questionNum;
    var questionText = "Question";

    var choices = ["Answer 1", "Answer 2", "Answer 3", "Answer 4"];

    var timer = 10;

    async function gotoResults() {
        goto("./leaderboard");
    }

</script>

    <div class="timer">
        {timer}
    </div>

    <div class="game_question">
        <h2>{questionText}</h2>
    </div>

    <div class="game_answer">
        <p>{choices[0]}</p>
    </div>

    <div class="game_answer">
        <p>{choices[1]}</p>
    </div>

    <div class="game_answer">
        <p>{choices[2]}</p>
    </div>

    <div class="game_answer">
        <p>{choices[3]}</p>
    </div>

    <div class="results" on:click={gotoResults}>
       Results
    </div>


<style>

    .timer {
        text-align: center;
    }

    .game_question {
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-radius: auto;
        justify-content: center;
    }

    .game_answer {
        margin-left: 30px;
        margin-right: 30px;
        margin: 2px;
        border: 2px;
        border-color: black;
        border-style: solid;
        text-align: center;
        display: flex;
        margin-left: auto;
        margin-radius: auto;
        justify-content: center;
    }

    .results {
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