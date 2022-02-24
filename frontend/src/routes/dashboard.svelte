<script>
	export const prerender = true;
	import axios from "axios";
    import { loggedInUser } from "../stores/stores.js";

	const api = axios.create({
		baseURL : "http://localhost:3000"
	});
</script>


<svelte:head>
	<title>Buddy Study</title>
</svelte:head>

<meta name="viewport" content="width=device-width, initial-scale=1">

<div class="top_menu">
    
	<div class="setting">
        <a href="/setting">
            <img class ="setting_img"src="./settings.png" alt="setting_png" width="7%">
        </a>
        setting
    </div>
   

    <div class="logout">
        <img class ="logout_img"src="./logout.png" alt="logout_png" width="7%">
        logout
    </div>
</div>

<div class="study_set">
    My Study Sets
    <h1>Current user is {$loggedInUser}</h1>
        <div class="add_study_set">
            <a href="/createStudySet">
                <img class ="add_img"src="./plus.png" alt="add_png" width="1.8%"> Add a Study Set
            </a>
        </div>
</div>

<div class="study_set_list">
    <!-- we are gonna call the list by using for loop. For now just make dummy one -->
    <a href="/studyset">
        <div class="study_set_box">science</div>
    </a>
</div>

<style>
	.top_menu {
        display: flex;
        margin-top: 1.5%;
        flex-direction: row;
        justify-content: center;
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

    .study_set {
        margin-top: 5%;
        font-family: 'Archivo Black', sans-serif;
		text-align: center;
		font-size: 3vw;
    }

    .add_study_set {
        margin-top: 3%;
        font-size: 2vw;
    }

    .study_set a {
        color: black;
        text-decoration: none;
    }

    .study_set_box{
        position: absolute;
        width: 321px;
        height: 104px;
        background-color: #799BF4;
        border-radius: 9px;
        text-align: center;
    }

</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Sans+Condensed&display=swap" rel="stylesheet">