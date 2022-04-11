<script>
    export const prerender = true;
	import axios from "axios";
	import { selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"
	import { goto } from "$app/navigation";

    export let global_view = {}; 
    export let leaderboard_view = {}; 

    let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    function playAgain() {
        global_view.currentView = global_view.ON_LOBBY; 
    }

    function exitGame() {
        global_view.myPlayerCh.detach(); 
        global_view.lobbyChannel.detach(); 
        goto("/dashboard");
    }

    let title = leaderboard_view.isLastQuestion ? "Final Results" : "Leaderboard"; 

</script>

<div class="results_header">
    <h1 class="results_header_style">{title}</h1>
</div>
<div id="leaderboard">
    <div class="leaderboard-row">
        <div class="column-key-box">Rank</div>
        <div class="column-key-box">Player</div>
        <div class="column-key-box">Score</div>
    </div>
    {#each leaderboard_view.leaderboard as player, i}
        <div class="leaderboard-row">
            <div class="player-info-box">
                {i+1}
            </div>
            <div class="player-info-box">
                {leaderboard_view.leaderboard[i].username}
            </div>
            <div class="player-info-box">
                {leaderboard_view.leaderboard[i].score}
            </div>
        </div>
    {/each}
</div>
{#if leaderboard_view.isLastQuestion}
    <div class="buttons">
        <button class="action-button" on:click={playAgain}>Play Again</button>
        <button class="action-button" on:click={exitGame}>Exit</button>
    </div>
{:else}
    <div class="timer">
        Next question in {leaderboard_view.nextQuestionTimer}
    </div>
{/if}

<style>
    .results_header {
        text-align: center;
    }

    .results_header_style {
        font-family: 'Fira Sans Condensed', sans-serif;
        font-size: 2.5vw;
    }

    .action-button {
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
    #leaderboard {
        display:flex; 
        flex-direction:column;
        align-items:center;
        width:auto;
        height:auto; 
        font-size:25px; 
    }
    .leaderboard-row {
        display:flex; 
        flex-direction:row; 
    }  
    .column-key-box {
        text-align:center;
        font-weight:bold; 
        width:10em; 
    }
    .player-info-box {
        width:10em; 
        text-align:center;
    }
    .buttons {
        display:flex;
        flex-direction:row; 
    }
    .timer {
        text-align: center;
        font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
        font-size: 27px;
        margin-bottom: 10px;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">
