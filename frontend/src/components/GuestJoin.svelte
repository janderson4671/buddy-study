<script>

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

    let joinGameCode = "";
	
    async function joinGame() {
		
    }
    async function cancelJoinGame() {
		
	}


</script>

<div class="join">
    <p class ="title">Join The Game!</p>

    <div class="user_input">
        <p class ="enterBuddyCode">Enter the Buddy Code</p>
        <input bind:value={joinGameCode}>

    </div>

    <div class="buttons">
        <div class="save_button">
            <button on:click={joinGame}>join</button>
        </div>

        <div class="cancel_button">
            <button on:click={cancelJoinGame}>cancel</button>
        </div>
    </div>
</div>


<style>

    .join {

    }

	.title {
		color: #000000;
		font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 3vw;
		margin: 4%;
	}

	.user_input {
		/* display: flex;
		flex-direction: column; */
		/* justify-content: center; */
		text-align: center;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: 1.25vw;
		margin: 0;
	}

	.buttons{
		display: flex;
		justify-content: center;
		margin-top: 3%;
		margin-bottom: 2%;
	}

	.save_button {
		margin-right: 2%;
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