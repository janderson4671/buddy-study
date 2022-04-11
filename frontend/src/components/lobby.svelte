<script>
    import { onMount } from "svelte"; 

    export let global_view = {}; 

    async function startGame() {
        if (!global_view.gameStarted) {
            global_view.hostAdminCh.publish("start-game", {} ); 
        }
	}

    async function readyUp() {
        global_view.isReady = !global_view.isReady; 
        global_view.myPlayerCh.publish("toggle-ready", {
            ready: global_view.isReady 
        }); 
    }

    async function editStudySet() {
        
    }
</script>

<div class="buddyCode">
    tempBuddy Code: {global_view.lobbyId}
    <div class="studysetTitle">
        Study Set Subject: {global_view.curStudySetName}
    </div>
    <div class="guest_list">
        {#each Object.entries(global_view.players) as [playerId, player]}
            {player.username}
            {#if player.isReady}
                Ready! 
            {:else}
                waiting...
            {/if}
            {#if player.isHost}
                HOST
            {/if}
            <br>
        {/each}
    </div>
</div>

{#if global_view.isHost}
    <div class="buttons">
        <div class="start-or-ready-button">
            <button on:click={startGame}>Start game</button>
        </div>

        <div class="editStudySet_button">
            <button on:click={editStudySet}>Change Study Set</button>
        </div>
    </div>
{:else}
    <div class="start-or-ready-button">
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

    .start-or-ready-button {
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