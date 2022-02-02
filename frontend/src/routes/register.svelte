<script>
	export const prerender = true;

	import axios from "axios";
	let username = "";
	let password = "";
	let email = "";

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


<h1>Welcome to Buddy Study!</h1>

<h2>
	Register to start studying!
</h2>

<input bind:value={username} placeholder="username">
<br>
<input bind:value={password} placeholder="password">
<br>
<input bind:value={email} placeholder="email">
<br>

{#if username !== "" && email !== "" && password != ""}
	<button on:click={registerUser}>register</button>
{/if}

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

	button {
		border-radius: 30px;
		position: absolute;
		width: 211px;
		height: 57.23px;
		font-family: Fira Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 34px;
		line-height: 41px;
		text-align: center;
		background: 79c8f4;
		color: #000000;


		
	}

	
</style>
