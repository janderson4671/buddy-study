<script>
    export const prerender = true;
	import axios from "axios";
    import { goto } from "$app/navigation";
    import { loggedInUser, IS_DEPLOYED } from "../stores/stores.js";

    let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    const gotoLogin = function() {
        // Remove global user
        $loggedInUser = "";

        goto("/");
    }
    const gotoSettings = function() {
        goto("/setting");
    }
    const gotoDashboard = function() {
        goto("/dashboard");
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
   
    <div class="setting" on:click={gotoDashboard}>
        <img class ="logout_img"src="./reading.png" alt="dashboard.png" width="7%">
        dashboard
    </div>

    <div class="logout" on:click={gotoLogin}>
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>
</div>

These are the settings.

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

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">