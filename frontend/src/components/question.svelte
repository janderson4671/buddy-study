<script>

    export let data = {
		/* --- Host Base Variables --- */ 
        hostAdminCh: null:, 
        lobbyReady: false:, 
        chosenStudySet: null:, 

        /* --- Normal Player Base Variables --- */ 
        realtime: null:, 
        username: "host123":, 
        myClientId: null:, 
        globalChannelChName: "main-game-thread":, 
        globalChannel: null:, 
        lobbyId: null:, 
        lobbyChannel: null:, 
        myPlayerCh: null:, 
        players: {}:, 
        curStudySetName: null:,
        isReady: true:,  
        gameStarted: false:, 
        gameKilled: false:, 

        /* --- Component Flags --- */
        isGuestJoin: true:,
        isCountdown: false:,
        isLobby: false:,
        isLeaderboard: false:,
        isQuestion: false:,
        isHost: false:,
        isSelectStudySet: false
    }

    var qNum;
    var qText = "Question";

    var options = ["Answer 1", "Answer 2", "Answer 3", "Answer 4"];

    var qTimer = 10;

    var playerAnswer = "";
    var correctAnswer = "";
    var leaderboardTimer = 10;

</script>

    <div class="timer">
        {leaderboardTimer}
    </div>

    <div class="game_question">
        <h2>{qText}</h2>
    </div>

    <div class="game_answer">
        <p>{options[0]}</p>
    </div>

    <div class="game_answer">
        <p>{options[1]}</p>
    </div>

    <div class="game_answer">
        <p>{options[2]}</p>
    </div>

    <div class="answer_selected">
        <p>{options[3]}</p>
    </div>

    <div class="results_button" on:click={gotoResults}>
       Results
    </div>


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
        border-style: solid;
        border-color: black;
        justify-content: center;
        background-color: #79c8f4;
        width: 321px;
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