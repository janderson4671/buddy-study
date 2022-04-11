<script>
    export const prerender = true;
	import axios from "axios";
    import * as Ably from 'ably';
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

    let global_view = {
        /* --- Host Base Variables --- */ 
        hostAdminCh: null, 
        lobbyReady: false, 
        chosenStudySet: null, 

        /* --- Normal Player Base Variables --- */ 
        realtime: null, 
        username: $loggedInUser, 
        myClientId: null, 
        globalChannelChName: "main-game-thread", 
        globalChannel: null, 
        lobbyId: null, 
        lobbyChannel: null, 
        myPlayerCh: null, 
        players: {}, 
        curStudySetName: null,
        isHost: false, 
        isReady: false,  
        gameStarted: false, 
        gameKilled: false, 

        /* --- Component Flags --- */
        isOnServer: false,
        currentView: 0, 

        /* --- Component Constants --- */ 
        ON_ENTRY: 0, 
        ON_LOBBY: 1, 
        ON_COUNTDOWN: 2, 
        ON_QUESTION: 3, 
        ON_LEADERBOARD: 4, 
        ON_SELECT_STUDYSET: 5,
    }

    /* --- In-Game Variables --- */ 

    let countdown_view = {
        // Game Countdown View
        countdownTimer: 0, 
    }

    let question_view = {
        // Question View
        qNum: 0, 
        qTimer: 0, 
        qText: null, 
        options: null, 
        questionAnswered: false, 
        playerAnswer: null, 
        correctAnswer: null, 
        leaderboardTimer: null, 
        questionAnswered: false, 

        showAnswers: false, 
    }

    let leaderboard_view = {
        // Leaderboard View
        isLastQuestion: false, 
        leaderboard: null, 
        nextQuestionTimer: 0, 
        playAgainSelected: false, 
        quitSelected: false, 
    }

    let inputCode = ""; 
    let realtimeInitialized = false; 
    initializeRealtime();   

    if ($selectedStudySet != null) {
        global_view.chosenStudySet = $selectedStudySet; 
        handleCreateLobby();
    }

    async function initializeRealtime() {
        global_view.realtime = new Ably.Realtime({
            authUrl: ($IS_DEPLOYED ? "" : "http://localhost:3000") + "/api/game/auth"
        });
        realtimeInitialized = true; 
    }
    async function handleCreateLobby() {
        global_view.isHost = true; 
        global_view.isReady = true; 
        let res = await api.get("/api/game/newlobby" + "?username=" + global_view.username); 
        global_view.lobbyId = res.data.lobbyId; 
        while (!realtimeInitialized) {}
        global_view.lobbyChannel = global_view.realtime.channels.get(
            `${global_view.lobbyId}:primary`
        ); 
        global_view.hostAdminCh = global_view.realtime.channels.get(
            `${global_view.lobbyId}:host`
        ); 
        // Once thread is prepared we can subscribe to the lobby
        global_view.lobbyChannel.subscribe("thread-ready", () => {
            // Handle Lobby Prepared
            global_view.lobbyReady = true; 
            global_view.globalChannel = detach(); 

            subscriptions(); 
            
            if (global_view.chosenStudySet != null) {
                global_view.hostAdminCh.publish("load-studyset", {
                    studysetID: global_view.chosenStudySet 
                }); 
            }
        }); 
        // Enter Main Thread
        global_view.globalChannel = global_view.realtime.channels.get(global_view.globalChannelChName); 
        global_view.globalChannel.presence.enter({
            username: global_view.username, 
            lobbyId: global_view.lobbyId
        }); 
        global_view.currentView = global_view.ON_LOBBY; 
        global_view.isOnServer = true; 
    }

    async function isLobbyEmpty() { 
        let promise = await new Promise((resolve, reject) => {
            global_view.lobbyChannel.presence.get((err, players) => {
                resolve(err || players.length < 1); 
            }); 
        })
        .catch(err => {throw err}); 

        return promise; 
    }

    async function handleJoinGame() {
        global_view.isHost = false; 
        global_view.lobbyChannel = global_view.realtime.channels.get(
            `${inputCode}:primary`
        ); 
        if (!(await isLobbyEmpty())) {
            global_view.lobbyId = inputCode; // The variable input here is whatever code was entered
            subscriptions(); 
            global_view.currentView = global_view.ON_LOBBY;             
            global_view.isOnServer = true; 
        } else {
            global_view.lobbyId = null; 
            global_view.lobbyChannel = null; 
        }
    }

    function subscriptions() {
        // Enter Lobby
        global_view.lobbyChannel.presence.enter({
            username: global_view.username, 
            isHost: global_view.isHost,
        }); 

        // Subscribe to Lobby Channels
        global_view.lobbyChannel.subscribe("update-player-states", msg => {
            global_view.players = msg.data; 
            global_view.isReady = global_view.players[global_view.myClientId].isReady; 
        }); 
        global_view.lobbyChannel.subscribe("update-readied", msg => {
            global_view.players[msg.data.playerId].isReady= msg.data.isReady; 
        }); 
        global_view.lobbyChannel.subscribe("countdown-timer", msg => {
            global_view.gameStarted = true; 
            countdown_view.countdownTimer = msg.data.countDownSec; 
        }); 
        global_view.lobbyChannel.subscribe("new-question", msg => {
            question_view.questionAnswered = false; 
            question_view.playerAnswer = null; 
            question_view.qNum = msg.data.questionNumber;
            question_view.qText = msg.data.questionText; 
            question_view.options = msg.data.options; 
        }); 
        global_view.lobbyChannel.subscribe("question-timer", msg => {
            question_view.qTimer = msg.data.countDownSec; 
        }); 
        global_view.lobbyChannel.subscribe("correct-answer", msg => {
            question_view.correctAnswer = msg.data.answerText; 
        }); 
        global_view.lobbyChannel.subscribe("leaderboard-timer", msg => {
            leaderboard_view.leaderboardTimer = msg.data.countDownSec; 
        }); 
        global_view.lobbyChannel.subscribe("new-leaderboard", msg => {
            leaderboard_view.isLastQuestion = msg.data.isLastQuestion; 
            leaderboard_view.leaderboard = msg.data.leaderboard; 
            leaderboard_view.leaderboard.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1) : -1); 
            if (leaderboard_view.isLastQuestion) {
                global_view.gameStarted = false; 
            }
        }); 
        global_view.lobbyChannel.subscribe("next-question-timer", msg => {
            leaderboard_view.nextQuestionTimer = msg.data.countDownSec; 
        }); 
        global_view.lobbyChannel.subscribe("kill-lobby", msg => {
            global_view.gameKilled = true; 
        }); 

        // Set up my player
        global_view.myClientId = global_view.realtime.auth.clientId; 
        global_view.myPlayerCh = global_view.realtime.channels.get(
            `${global_view.lobbyId}:player-ch-${global_view.myClientId}`
        )
    }

</script>

<p>Content</p>
{#if global_view.isOnServer}
    {#if global_view.currentView == global_view.ON_LOBBY}
        <Lobby bind:global_view></Lobby>
    {:else if global_view.currentView == global_view.ON_COUNTDOWN}
        <Countdown bind:global_view bind:countdown_view></Countdown>
    {:else if global_view.currentView == global_view.ON_LEADERBOARD}
        <Leaderboard  bind:global_view bind:leaderboard_view></Leaderboard>
    {:else if global_view.currentView == global_view.ON_QUESTION}
        <Question bind:global_view bind:question_view></Question>
    {:else if global_view.currentView == global_view.ON_SELECT_STUDYSET}
        {#if global_view.isHost}
            <SelectStudySet bind:global_view></SelectStudySet>
        {/if}
    {/if}
{:else}
    {#if {realtimeInitialized}}
        <p>JOIN GAME</p>
        <input bind:value={inputCode}/>
        <button on:click={handleJoinGame}>Join</button>
    {:else}
        <p>Realtime isn't initializing...</p>
    {/if}
{/if}