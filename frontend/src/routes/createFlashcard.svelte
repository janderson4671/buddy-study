<script>
	export const prerender = true;
	import axios from "axios";

	let question_input = null;
    let answer_input = null;

	const api = axios.create({
		baseURL : "http://localhost:3000"
	});


    async function saveFlashcard() {
		console.log("check");
		try {
			let flashcardRequest = {
				studysetID: "1234",
				questionNum: 1,
				questionText: question_input,
				answerText: answer_input,
			};
			var response = await api.post("/api/flashcard/create", flashcardRequest);

			console.log(response.data.success);

			if (response.data.success) {
				alert("just added the flash card");
				window.location.href = "/studyset";
			}
			else {
				alert("failed adding a flash card" + response.data.message);
			}
			

		} catch (error) {
			console.log(error);
			alert("failed!");
		}
    }

    async function cancelFlashcard() {

}

</script>


<svelte:head>
	<title>Buddy Study</title>
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1">

<p class ="title">New Flash Card</p>

<div class="user_input">
	<p class ="qna">Question Side</p>
	<textarea class="textbox" name="question_input" rows="9" cols="60"></textarea>
    <p class ="qna">Answer Side</p>
	<textarea  class="textbox" name="answer_input" rows="9" cols="60"></textarea>
</div>

<div class="buttons">
	<div class="save_button">
		<button on:click={saveFlashcard}>save</button>
	</div>

	<div class="cancel_button">
		<button on:click={cancelFlashcard}>cancel</button>
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

	.textbox {
		font-family: 'Fira Sans Condensed', sans-serif;
		background-color: #ECE8E8;
		outline: none;
		border: none;
		box-shadow: 2px 3px gray;
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

	

	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">