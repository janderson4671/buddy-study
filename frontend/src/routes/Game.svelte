<script>
    export const prerender = true;
	import axios from "axios";
    import { goto } from "$app/navigation";
    import { loggedInUser, selectedStudySet, IS_DEPLOYED} from "../stores/stores.js"
    import { onMount } from "svelte";

    /* --- Child Components --- */
    import Countdown from "../components/Countdown.svelte";
    import Leaderboard from "../components/Leaderboard.svelte";
    import Lobby from "../components/Lobby.svelte";
    import Question from "../components/Question.svelte";
    import GuestJoin from "../components/GuestJoin.svelte";
    import Nested from "../components/Nested.svelte";

    
	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    /* --- Host Base Variables --- */ 
    var hostAdminCh = null; 
    var lobbyReady = false; 
    var chosenStudySet = null; 

    /* --- Normal Player Base Variables --- */ 
    var realtime = null; 
    var username = "host123"; 
    var myClientId = null; 
    var globalChannelChName = "main-game-thread"; 
    var globalChannel = null; 
    var lobbyId = null; 
    var lobbyChannel = null; 
    var myPlayerCh = null; 
    var players = {}; 
    var curStudySetName = null;
    var isReady = true;  
    var gameStarted = false; 
    var gameKilled = false; 


</script>

<p>Content</p>
<Lobby/>
<p>End Content</p>
