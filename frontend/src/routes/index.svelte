<script>
	export const prerender = true;
	import axios from "axios";
	import { loggedInUser } from "../stores/stores.js"
	import { goto } from "$app/navigation"

	let username_input = null;
	let password_input = null;

	const api = axios.create({
		baseURL : "http://localhost:3000"
	});

	async function loginUser() {

		try {
			let loginRequest = {
				username: username_input,
				password: password_input,
				
			};
			console.log(username_input);
			console.log(password_input);

			var response = await api.post("/api/user/login", loginRequest);
			if (response.data.success) {
				alert("Welcome " + username_input +"!");
				// Set the global username
				$loggedInUser = username_input;

				// Redirect user to dashboard page
				goto("/dashboard", false);
			}
			// alert("User has been logged in!");

		} catch (error) {
			console.log(error);
			alert("Login is unsuccessful!");
		}
	}

</script>


<svelte:head>
	<title>Buddy Study</title>
	
</svelte:head>


<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="title">
	<div class='blank'>
		Buddy<img class ="logoImg"src="./reading.png" alt="logo_png" width="6%">
	</div>
	STUDY!
</div>

<div class="user_input">
	<p class ="text">username</p>
	<input bind:value={username_input} placeholder="username">
	<p class ="text">password</p>
	<input bind:value={password_input} placeholder="password">
	<!-- <p class ="text">email</p>
	<input bind:value={email} placeholder="email"> -->
</div>

<div class="login_button">
	<!-- {#if username !== "" && email !== "" && password != ""}
	{/if} -->
	<button on:click={loginUser}>login</button>
</div>

<div class="space_between_login_reg"></div>

<div class="register_button">
	<a href="/register">Not registered?</a>
</div>

<style>

	input {
		height: 3%;
		width: 25%;
		padding: 2%;
		margin: 1rem;
		align-self: center;
	}

	button {
		border-radius: 30px;
		position: absolute;
		width: 18vw;
		height: 5vw;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 2vw;
		text-align: center;
		background:#000000;
		color: white;
	}

	.title {
		color: #000000;
		font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 5vw;
		margin: 5%;
	}

	.blank {
		padding-left: 1.5%;
	}

	.user_input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: 1.25vw;
		margin: 0;
	}

	.text {
		padding-left: 35.5%;
		margin: 0;
	}

	.login_button {
		display: flex;
		justify-content: center;
		margin: 3%
	}

	.register_button {
		display: flex;
		justify-content: center;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: 1.25vw;
		margin: 3%;
	}

	.space_between_login_reg {
		margin: 7%;
	}

	
</style>
	
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">