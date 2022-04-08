<script>

    import { onMount } from "svelte";

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


    onMount(async () => {
        initializeGameVars();
    });
    
    
    const loadStudySets = async function() {
        /*
        $realtime = await Ably.Realtime({
            authUrl: apiURL + "/api/game/auth"
        });
        $lobbyChannel = $realtime.channels.get(
            `//${$lobbyId}:primary`
        ); 
        $hostAdminCh = $realtime.channels.get(
            //`${$lobbyId}:host`
        );
        */
    }

    async function startGame() {
        gameStarted = true;
        
	}

    async function editStudySet() {
        
    }

    
</script>




<!-- Should show the list of people in here -->
<!-- <div class="guest_list">
    {#each  as {}}
        player.username 
        {#if player.isReady}
            Ready!
        {/if}
        {#if !player.isReady}
            waiting...
        {/if}
    {/each}
</div> -->

<div class="buddyCode">
    tempBuddy Code: sdf468w!

    <p>Player1</p>
    <p>Player2</p>
</div>


<div class="studysetTitle">
    Geography

    <!--Study Set: {$selectedStudySet.subject}-->
</div>



<!--Need to put this button inside of each study sets-->
<div class="buttons">
    <div class="startgame_button">
        <button on:click={startGame}>Start game</button>
    </div>

    <div class="editStudySet_button">
        <button on:click={editStudySet}>Change Study Set</button>
    </div>
</div>

<style>

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

    .buttons{
		display: flex;
		justify-content: center;
		margin-top: 3%;
		margin-bottom: 2%;
	}

    .startgame_button {
        margin-right: 2%;
    }

    .buddyCode {
        text-align: center;
        font-family: 'Fira Sans Condensed', sans-serif;
        font-weight: bold;
        margin: 3%;
    }

    .studysetTitle {
        text-align: center;
        font-family: 'Fira Sans Condensed', sans-serif;
        font-weight: bold;
        margin: 3%;
    }
	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">