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
    import SelectStudySet from "../components/SelectStudySet.svelte";

    
	let apiURL = ($IS_DEPLOYED ? "" : "http://localhost:3000");
	const api = axios.create({
		baseURL : apiURL
	});

    let data = {
		/* --- Host Base Variables --- */ 
        hostAdminCh: null, 
        lobbyReady: false, 
        chosenStudySet: null, 

        /* --- Normal Player Base Variables --- */ 
        realtime: null, 
        username: "host123", 
        myClientId: null, 
        globalChannelChName: "main-game-thread", 
        globalChannel: null, 
        lobbyId: null, 
        lobbyChannel: null, 
        myPlayerCh: null, 
        players: {}, 
        curStudySetName: null,
        isReady: true,  
        gameStarted: false, 
        gameKilled: false, 

        /* --- Component Flags --- */
        isGuestJoin: true,
        isCountdown: false,
        isLobby: false,
        isLeaderboard: false,
        isQuestion: false,
        isHost: false,
        isSelectStudySet: false
    }

        
    



</script>



<p>Content</p>

{#if data.isHost}
 //show host of lobby
    {#if data.isCountdown}
       <Countdown bind:data></Countdown>
    {:else if data.isLeaderboard}
        <Leaderboard  bind:data></Leaderboard>
    {:else if data.isQuestion}
        <Question bind:data></Question>
    {:else if data.isLobby}
        <Lobby bind:data></Lobby>
    {:else if data.isSelectStudySet}
        <SelectStudySet bind:data></SelectStudySet>
    {/if}

{:else}
    {#if data.isGuestJoin}
        <GuestJoin bind:data></GuestJoin>
    {:else if data.isCountdown}
        <Countdown bind:data></Countdown>
    {:else if data.isLeaderboard}
        <Leaderboard bind:data></Leaderboard>
    {:else if data.isQuestion}
        <Question bind:data></Question>
    {:else if data.isLobby}
        <Lobby bind:data></Lobby>
    {:else if data.isSelectStudySet}
        <SelectStudySet bind:data></SelectStudySet>
    {/if}
    
{/if}


<p>End Content</p>
