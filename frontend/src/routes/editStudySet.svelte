<script>
    export const prerender = true;
    import { loggedInUser, selectedStudySet, IS_DEPLOYED, lobbyId } from "../stores/stores.js"
    import { onMount } from "svelte";
    import axios from "axios";
    import { goto } from "$app/navigation"
    import FlashCardView from "../components/FlashCardView.svelte";

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    let flashcards = []

    onMount(async () => {
        try {
            let response = await api.get("/api/flashcard/allcards/" + $selectedStudySet);
            if (!response.data.success) {
                alert(response.data.message);
            }
            else {
                console.log(response.data.flashCards);
                if (response.data.flashCards) {
                    flashcards = response.data.flashCards;
                }
            }
        } catch(error) {
            console.log(error);
            alert("Something went wrong...");
        }
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

    const gotoCreateFlashcard = function() {
        goto("./createFlashcard");
    }

    async function startGame() {
        if (flashcards.length >= 4) {
            goto("/Game");
        } else {
            alert("Study set needs to have at least 4 flashcards to play a game!"); 
        }
        
    }

</script>

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

<div class="flashcard">
    <div class="add_flashcard" on:click={gotoCreateFlashcard}>
        <img class ="add_img"src="./plus.png" alt="add_png" width="1.8%"> Add a Flashcard
    </div>
</div>

<div class="flashcard_list">
    {#each flashcards as { questionText, answerText }}
        <FlashCardView question={questionText} answer={answerText}/>
    {/each}
</div>

<div class="start_button" on:click={startGame}>
    Start Game
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

    .flashcard {
        margin-top: 5%;
        font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 3vw;
    }

    .add_flashcard {
        margin-top: 3%;
        font-size: 2vw;
    }
    
    .flashcard_list {
        display: flex;
        flex-direction: column;
    }

    .start_button {
        margin-top: 3%;
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
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">