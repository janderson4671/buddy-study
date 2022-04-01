<script>
    export const prerender = true;
	import axios from "axios";
    import { goto } from "$app/navigation";
    
    import { loggedInUser, selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"
    import { onMount } from "svelte";

    var hostPlayer = {
        username: "host",
        isHost: true,
        isReady: false,
        score: 0
    }

    var lobbyId = 123456;
    var gameStarted = false;
    var curStudySetName = selectedStudySet.subject


	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    async function startGame() {
        gameStarted = true;
        goto("./gameCountDown");
	}

    async function editStudySet() {
        goto("./lobbymain");
    }

    const gotoLogin = function() {
        // Remove global user
        $loggedInUser = "";

        goto("/");
    }
    const gotoSettings = function() {
        goto("/setting");
    }
</script>

<svelte:head>
	<title>Buddy Study</title>
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="top_menu">
    
	<div class="setting" on:click={gotoSettings}>
        <img class ="setting_img"src="./settings.png" alt="setting_png" width="7%">
        settings
    </div>
   
    <div class="setting">
        <img class ="logout_img"src="./reading.png" alt="dashboard.png" width="7%">
        dashboard
    </div>

    <div class="logout" on:click={gotoLogin}>
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>

</div>


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
    .top_menu {
        display: flex;
        margin-top: 1.5%;
        flex-direction: row;
        justify-content: center;
    }

    .setting {
        font-family: 'Fira Sans Condensed', sans-serif;
        font-size: 0.9vw;
        text-align: center;
    }

    .setting_img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        
    }

    .logout {
        font-family: 'Fira Sans Condensed', sans-serif;
        font-size: 0.9vw;
        text-align: center;
    }

    .logout_img {
        display: block;
        margin-left: auto;
        margin-right: auto;
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