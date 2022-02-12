<script>
	export const prerender = true;

	import axios from "axios";
	let username = "";
	let password = "";
	let email = "";
	let src = "../../static/register.png"

	const api = axios.create({
		baseURL : "http://localhost:3000"
	});

	async function registerUser() {
		try {
			let response = await api.post("/api/user/register", {
				name: name,
				password: password,
				email: email
				
			});
			username = "";
			password = "";
			email = "";
			alert("User has been registered!");

		} catch (error) {
			console.log(error);
			alert("Error!");
		}
	}

</script>


<svelte:head>
	<title>Home</title>
	
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
	<input bind:value={username} >
	<p class="text">password</p>
	<input bind:value={password}>
	<p class="text">email</p>
	<input bind:value={email}>
</div>

<div class="register_button">
	{#if username !== "" && email !== "" && password != ""}
		<button on:click={registerUser}>register</button>
	{/if}
</div>

<style>

	input {
		height: 3%;
		width: 25%;
		padding: 2%;
		margin: 1rem;
		align-self: center;
	}


	h1,h2 {
		color: #385983;
		align-self: center;
		width: 100%;
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
		width: 211px;
		height: 57.23px;
		font-family: 'Fira Sans Condensed', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 34px;
		line-height: 41px;
		text-align: center;
		background: #000000;
		color: white;
		
		
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

	
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">