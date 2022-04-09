<script>

    import { onMount } from "svelte";

    export let global_view;


    onMount(async () => {
        
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

    async function readyUp() {
        data.isReady = true;
        alert("Ready to play!");
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
    tempBuddy Code: {global_view.lobbyId}

    <p>Player1</p>
    <p>Player2</p>
</div>


<div class="studysetTitle">
    Geography

    <!--Study Set: {$selectedStudySet.subject}-->
</div>



{#if data.isHost}
    <div class="buttons">
        <div class="startgame_button">
            <button on:click={startGame}>Start game</button>
        </div>

        <div class="editStudySet_button">
            <button on:click={editStudySet}>Change Study Set</button>
        </div>
    </div>
{:else}
    <div class="startgame_button">
            <button on:click={readyUp}>Ready</button>
    </div>
{/if}


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