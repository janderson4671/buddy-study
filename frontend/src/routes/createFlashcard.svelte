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


<div class="user_input">
	<p class ="text">New Flash Card</p>
    Question Side
	<input bind:value={question_input}>
    Answer Side
	<input bind:value={answer_input}>
</div>

<div class="save_button">
	<button on:click={saveFlashcard}>save</button>
</div>

<div class="cancel_button">
	<button on:click={cancelFlashcard}>cancel</button>
</div>

<style>

	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">