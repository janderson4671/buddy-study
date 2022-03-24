<script>
	export const prerender = true;
	import axios from "axios";
	import { IS_DEPLOYED } from "../stores/stores"

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

	async function createFlashCard() {
	}

</script>


<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="top_menu">
    
	<div class="dashboard">
        <a href="/dashboard">
            dashboard
        </a>
    </div>
   

    <div class="logout" on:click={gotoLogin}>
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>
</div>

<p class = "study_set_title">Study Set Title</p>

<div class="flashcards">
    <div class="add_flashcard">
        <a href="/createFlashcard">
            <img class ="add_img"src="./plus.png" alt="add_png" width="1.8%"> Add a Flash Card
        </a>
    </div>
	<div class="flashcard">
		<div class="flashcard_box">
			<div class="flashcard_question"> 
				What is the capital of Romania?
			</div>
		</div>
	</div>
	
	<div class="answer_button">
		<a href="/answerSideExample">
			Answer
		</a>
	</div>
	

	<div class="game_button">
		Start Game
	</div>

</div>


<style>


	.top_menu {
        display: flex;
        margin-top: 1.5%;
        flex-direction: row;
        justify-content: center;
		width: 60%;
		margin: auto;
    }

    .dashboard a {
        font-family: 'Fira Sans Condensed', sans-serif;
        font-size: 1vw;
        text-align: center;
		color: black;
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

	.study_set_title {
		margin-top: 5%;
        font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 3vw;
	}

	.flashcards {
		margin-top: 5%;
        font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 1vw;
	}

	.add_flashcard {
		margin-top: 3%;
        font-size: 2vw;
	}

	.add_flashcard a {
		color: black;
		margin-top: 3%;
        font-size: 2vw;
	}

	.flashcard {
		margin: auto;
		position: relative;
		width: 367px;
		height: 172px;

		background: #FFFFFF;
	}

	.flashcard_box {
		position: absolute;
		left: 0%;
		right: 0%;
		top: 6.4%;
		bottom: 8.14%;

		background: #799BF4;
		border-radius: 12px;

	}

	.flashcard_question {
		position: absolute;
		left: 30.52%;
		right: 30.79%;
		top: 23.84%;
		bottom: 63.37%;

		font-family: Fira Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		line-height: 22px;

		text-align: center;

		color: #FFFFFF;
	}

	.answer_button {
		border-radius: 30px;
		width: 82px;
		height: 45px;
		font-family: Fira Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		line-height: 41px;
		text-align: center;
		background-color: #79c8f4;
		
		margin: auto;
	}

	.answer_button a {
		color: black;
	}

	.game_button {
		border-radius: 30px;
		width: 166px;
		height: 45px;
		font-family: Fira Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 24px;
		line-height: 41px;
		text-align: center;
		background-color: #79c8f4;
		color: black;
		margin: auto;
		margin-top: 30px;
	}
	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">