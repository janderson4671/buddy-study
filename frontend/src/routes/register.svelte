<script>
	export const prerender = true;
	import axios from "axios";
	import { goto } from "$app/navigation"
	import { IS_DEPLOYED } from "../stores/stores";

	let username_register = "";
	let password_register = "";
	let email_register = "";
	let src = "../../static/register.png"

	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

	async function registerUser() {
		try {
			let registerRequest = {
				username: username_register,
				password: password_register,
				email: email_register
			};
			var response = await api.post("/api/user/register", registerRequest);

			if (response.data.success) {
				alert("registered " + response.data.username);

				// Redirect user to login page
				goto("/", false);
			}
			else {
				alert("register failed! " + response.data.message);
			}
			

		} catch (error) {
			console.log(error);
			alert("register failed!");
		}
	}

</script>


<svelte:head>
	<title>Buddy Study</title>
	
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1">
<div class="title">
	<img {src} alt="register">
	<br>
	Create<br>your own<br>account!
	<br>
	
</div>


<!--<img {src} alt="register">-->

<div class="register_input">
	<p class="text">username</p>
	<input bind:value={username_register} >
	<p class="text">password</p>
	<input bind:value={password_register}>
	<p class="text">email</p>
	<input bind:value={email_register}>
</div>

<!-- {#if response!= null && response.data.success} -->
	<!-- <a href="/"> -->
		<div class="register_button">
			<button on:click={registerUser}>register</button>
		</div>
	<!-- </a> -->
<!-- {/if} -->

<div class="blank"></div>

<!-- <a href="/">
	<div class="register_button">
		<button>Home</button>
	</div>
</a> -->
<!-- <div class="blank"></div> -->

<style>

	input {
		height: 3%;
		width: 25%;
		padding: 2%;
		margin: 1rem;
		align-self: center;
	}

	img {
		height: 125px;
		width: 124px;
		left: 134px;
		top: 100px;
		border-radius: 0px;
		align: center;

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
		color: white;;
	}

	.title {
		color: #000000;
		font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 36px;
		margin: 5%;
	}

	.text {
		padding-left: 35.5%;
		margin: 0;
	}

	.register_input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-size: 1.25vw;
		margin: 0;
	}

	.register_button {
		display: flex;
		justify-content: center;
		margin: 3%
	}

	.blank {
		margin: 8%;
	}

	
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">