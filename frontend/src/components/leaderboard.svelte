<script>

    export const prerender = true;
	import axios from "axios";
	import { selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"
	import { goto } from "$app/navigation";
	let startGameCode = null;

    export let data = {
		/* --- Host Base Variables --- */ 
        hostAdminCh: null, 
        lobbyReady: false, 
        chosenStudySet: null, 

        /* --- Normal Player Base Variables --- */ 
        realtime: null, 
        username: "host123", 
        myClientId: null, 
        globalChannelChName: "main-game-thread", 
        globalChannel: null, 
        lobbyId: null, 
        lobbyChannel: null, 
        myPlayerCh: null, 
        players: {}, 
        curStudySetName: null,
        isReady: true,  
        gameStarted: false, 
        gameKilled: false, 

        /* --- Component Flags --- */
        isGuestJoin: true,
        isCountdown: false,
        isLobby: false,
        isLeaderboard: false,
        isQuestion: false,
        isHost: false,
        isSelectStudySet: false
    }

    var nextQuestionTimer = 10;
    var isLastQuestion = false;
    var leaderboard = "";
    var playAgainSelected = false;
    var quitSelectes = false;

    var players = ["Player1", "Player2"];

    let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    const exitGame = function() {
        goto("/dashboard");
    }

</script>

    {#if !isLastQuestion}
    <div class="results_header">
            <h1 class="results_header_style">Results</h1>
            <p1>Player1:   3</p1><br>
            <p1>Player2:   4</p1><br>
            Next question in {nextQuestionTimer}
        </div>

        <!-- display players with scores 

        {#each players as PlayerList}
            
        {/each}
        -->


    {/if}
    {#if isLastQuestion} 
        <div class="results_header">
            Final Results
        </div>

        <!-- display players with scores 

        {#each players as PlayerList}
            
        {/each}
        -->
        <button>Play Again</button>
        <button>Exit</button>
    {/if}

    <div class = exit_button on:click={exitGame}>Exit</div>

<style>

    .results_header {
        text-align: center;
    }

    .results_header_style {
        font-family: 'Fira Sans Condensed', sans-serif;
        font-size: 2.5vw;
    }

    .exit_button {
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
