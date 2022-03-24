<script>
	export const prerender = true;
	import axios from "axios";
	import { selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"
	import { goto } from "$app/navigation";
	let joinGameCode = null;

	var isReady = false;

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});
    async function joinGame() {
		console.log("check");
		// this needs to be changed to validate the code and retrieve the game
		goto("./lobbyguest");
    }
    async function cancelJoinGame() {
		goto("./dashboard");
	}

    const gotoLogin = function() {
        // Remove global user
        // $loggedInUser = "";

        goto("/");
    }
    const gotoSettings = function() {
        goto("/setting")
    }

</script>


<svelte:head>
	<title>Buddy Study</title>
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="top_menu">
    
	<div class="setting" on:click={gotoSettings}>
        <img class ="setting_img"src="./settings.png" alt="setting_png" width="7%">
        setting
    </div>
   

    <div class="logout" on:click={gotoLogin}>
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>
</div>

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

<style>
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

	

	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">