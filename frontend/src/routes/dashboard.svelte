<script>
    export const prerender = true;
	import axios from "axios";
    import { goto } from "$app/navigation";
    import { loggedInUser, IS_DEPLOYED } from "../stores/stores.js";
    import { onMount } from "svelte";
    import StudySetView from "../components/StudySetView.svelte";

    let userStudySets = [];

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    onMount(async () => {
        loadStudySets();
    });

    const loadStudySets = async function() {
        let response = await api.get("/api/studyset/allsets/" + $loggedInUser);
        if (!response.data.success) {
            alert(response.data.message)
        } else {
            if (response.data.studysets) {
                userStudySets = response.data.studysets;
            }
        }
    }

    const gotoLogin = function() {
        // Remove global user
        $loggedInUser = "";

        goto("/");
    }
    const gotoSettings = function() {
        goto("/setting");
    }
    const gotoCreateStudySet = function() {
        // Need information about selected study set
        goto("/createStudySet");
    }
    const joinAGame = function() {
        console.log("joining");
        goto("/Game");
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

<div class="join_button" on:click={joinAGame}>
    Join Game
</div>

<div class="study_set">
    My Study Sets
        <div class="add_study_set" on:click={gotoCreateStudySet}>
            <img class ="add_img"src="./plus.png" alt="add_png" width="1.8%"> Add a Study Set
        </div>
</div>

<div class="study_set_list">
    {#each userStudySets as { subject, studysetID }}
        <StudySetView subject={subject} id={studysetID}/>
    {/each}
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

    .study_set {
        margin-top: 5%;
        font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 3vw;
    }

    .add_study_set {
        margin-top: 3%;
        font-size: 2vw;
    }
    
    .study_set_list {
        display: flex;
        flex-direction: column;
    }

    .join_button {
        margin-top: 3%;
        border-radius: 30px;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 1.2vw;
		text-align: center;
		background: #79C8F4;
		color: black;
		width: 10vw;
		height: 3vw;
		border: none;
		box-shadow: 2px 3px gray;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">