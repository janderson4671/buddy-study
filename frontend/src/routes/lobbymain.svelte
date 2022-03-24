<script>
    export const prerender = true;
	import axios from "axios";
    import { goto } from "$app/navigation";
    import { loggedInUser, IS_DEPLOYED } from "../stores/stores.js";
    import { onMount } from "svelte";

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    async function startGame() {
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


<!-- Should show the list of study sets in here -->
<!-- <div class="study_set_list">
    {#each userStudySets as { subject, studysetID }}
        <StudySetView subject={subject} id={studysetID}/>
    {/each}
</div> -->

<!--Need to put this button inside of each study sets-->
<div class="buttons">
    <div class="save_button">
        <button on:click={startGame}>Start game</button>
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
		font-size: 0.8vw;
		text-align: center;
		background:#79C8F4;
		color: black;
		width: 5vw;
		height: 1.5vw;
		border: none;
		box-shadow: 2px 3px gray;
	}

    .buttons{
		display: flex;
		justify-content: center;
		margin-top: 3%;
		margin-bottom: 2%;
	}
	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">