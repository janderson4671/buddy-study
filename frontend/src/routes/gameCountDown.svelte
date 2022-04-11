<script>
    import { goto } from "$app/navigation";
    import { loggedInUser, selectedStudySet, IS_DEPLOYED } from "../stores/stores.js"

    var countDownTimer = 10;

    async function beginGame() {
        goto("./gameQuestion");
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


<div class="top_menu">
    
	<div class="setting" on:click={gotoSettings}>
        <img class ="setting_img"src="./settings.png" alt="setting_png" width="7%">
        settings
    </div>
   

    <div class="logout" on:click={gotoLogin}>
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>

</div>

<div class = 'countDown'>

    <div class="game_start">
        <h1>Game starts in...<h1>
    </div>

    <div class="count_down">
        <h1>{countDownTimer}<h1>
    </div>

    <div class="next_button">
        <button on:click={beginGame}>Next</button>
    </div>

</div>


<style>

    .countDown {
        margin: 10%;
    }

    .count_down {
        font-family: 'Fira Sans Condensed', sans-serif;
        text-align: center;
        display: flex;
        margin-left: auto;
        justify-content: center;
    }

    .game_start {
        font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 1.2vw;
        text-align: center;
    }

    .next_button {
        text-align: center;
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

    .top_menu {
        display: flex;
        margin-top: 1.5%;
        flex-direction: row;
        justify-content: center;
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