<script>
    import { goto } from "$app/navigation";
    import { loggedInUser, selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"

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

    var countDownTimer = 10;

    const count_down = function() {

    }

    const beginGame = function() {
    }

</script>



<div class = 'countDown'>

    <div class="game_start">
        <h1>Game starts in...<h1>
    </div>

    <div class="count_down">
        <h1>{count_down}<h1>
    </div>

    <div class="next_button">
        <button on:click={beginGame}>Next</button>
    </div>

</div>


<style>

    .countDown {
        margin: 10%;
    }

    .count_down {
        font-family: 'Fira Sans Condensed', sans-serif;
        text-align: center;
        display: flex;
        margin-left: auto;
        justify-content: center;
    }

    .game_start {
        font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 1.2vw;
        text-align: center;
    }

    .next_button {
        text-align: center;
    }
    
    button {
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
	}

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">