<script>
	export const prerender = true;
	import axios from "axios";
	import { loggedInUser, IS_DEPLOYED } from "../stores/stores.js"
	import { goto } from "$app/navigation"
	let studyset_title = null;
	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});
    async function saveStudySet() {
		let request = {
			username: $loggedInUser,
			subject: studyset_title
		}
		try {
			let response = await api.post("/api/studyset/create", request);
			if (response.data.success) {
				alert("Successfully made " + studyset_title + " studyset!");
				goto("/dashboard")
			} else {
				alert(response.data.message)
			}
		} catch (error) {
			console.log(error);
			alert("Something went wrong!");
		}
    }
    async function cancelStudySet() {
		// Navigate back to dashboard
		goto("/dashboard");
	}
</script>


<svelte:head>
	<title>Buddy Study</title>
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="title">
	<p class ="text">New Study Set</p>
</div>

<div class="user_input">
	<p class ="set_title">Study Set Title</p>
	<input bind:value={studyset_title}>
</div>

<div class="buttons">
	<div class="save_button">
		<button on:click={saveStudySet}>save</button>
	</div>

	<div class="cancel_button">
		<button on:click={cancelStudySet}>cancel</button>
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
		text-align: center;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: 1.25vw;
	}

	.textbox {
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: large;
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