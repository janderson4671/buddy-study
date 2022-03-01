<script>
	export const prerender = true;
	import axios from "axios";
	import { loggedInUser } from "../stores/stores.js"
	import { goto } from "$app/navigation"

	let studyset_title = null;

	const api = axios.create({
		baseURL : "http://localhost:3000"
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

</div>

<div class="user_input">
	<p class ="text">New Study Set</p>
    Study Set Title
	<input bind:value={studyset_title}>
</div>

<div class="save_button">
	<button on:click={saveStudySet}>save</button>
</div>

<div class="cancel_button">
	<button on:click={cancelStudySet}>cancel</button>
</div>

<style>

	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">