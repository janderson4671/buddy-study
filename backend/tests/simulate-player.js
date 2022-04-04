// Testing setup
const axios = require("axios"); 
const {response} = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
}); 
const Ably = require("ably"); 
const readline = require("readline"); 
const testUtils = require("./test-utils"); 

let simulatePlayer = async function simulatePlayer(username) {
    let playerRegisterRequest = {
        username: username, 
        password: "password", 
        email: `${username}@email.com`
    }

    data = {
        /* --- Normal Player Base Variables --- */ 
        realtime: null, 
        username: username, 
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

        /* --- In-Game Variables --- */ 
        // Game Countdown View
        countdownTimer: 0, 

        // Question View
        qNum: 0, 
        qTimer: 0, 
        qText: null, 
        options: null, 
        playerAnswer: null, 
        correctAnswer: null, 
        leaderboardTimer: null, 

        // Leaderboard View
        isLastQuestion: false, 
        leaderboard: null, 
        nextQTimer: 0, 
        playAgainSelected: false, 
        quitSelected: false, 
    }
    // Open ABLY Realtime Connection
    try {
        data.realtime = await Ably.Realtime({
            authUrl: "http://localhost:3000/api/game/auth"
        });
    } catch (error) {
        testUtils.reportFailure(error); 
        process.exit(1); 
    }
    if (data.realtime != null) {
        console.log("SUCCESS: Connected to ABLY API"); 
    }

    // Function to check if the lobbyChannel is active
    async function isLobbyEmpty() {
        let promise = await new Promise((resolve, reject) => {
            data.lobbyChannel.presence.get((err, players) => {
                resolve(err || players.length < 1); 
            }); 
        })
        .catch(err => {throw err}); 

        return promise; 
    }

    // Input Lobby Code
    while (true) {
        let input = await testUtils.pauseForUserInput("Please enter your Lobby Code: ");
        data.lobbyChannel = data.realtime.channels.get(
            `${input}:primary`
        ); 
        if (!(await isLobbyEmpty())) {
            data.lobbyId = input;
            break; 
        } 
    }

    // TODO: Add subscriptions, enter lobby channel, create myPlayerCh, etc. 
    
    // Enter Lobby
    data.lobbyChannel.presence.enter({
        username: data.username, 
        isHost: false, 
    }); 

    // Subscribe to Lobby Channels
    data.lobbyChannel.subscribe("update-player-states", msg => {
        data.players = msg.data; 
        displayLobbyDashboard(); 
    }); 

    data.lobbyChannel.subscribe("update-player-states", msg => {
        data.players = msg.data; 
        displayLobbyDashboard(); 
    }); 
    data.lobbyChannel.subscribe("update-readied", msg => {
        data.players[msg.data.playerId].isReady = msg.data.isReady; 
        displayLobbyDashboard(); 
    }); 
    data.lobbyChannel.subscribe("studyset-loaded", msg => {
        data.curStudySetName = msg.data.studysetSubject; 
        displayLobbyDashboard(); 
    }); 
    data.lobbyChannel.subscribe("countdown-timer", msg => {
        data.gameStarted = true; 
        data.countdownTimer = msg.data.countDownSec; 
    }); 
    data.lobbyChannel.subscribe("new-question", msg => {
        data.qNum = msg.data.questionNumber; 
        data.qText = msg.data.questionText; 
        data.options = msg.data.choices; 
    }); 
    data.lobbyChannel.subscribe("question-timer", msg => {
        data.qTimer = msg.data.countDownSec; 
    }); 
    data.lobbyChannel.subscribe("correct-answer", msg => {
        data.correctAnswer = msg.data.answerText; 
    }); 
    data.lobbyChannel.subscribe("leaderboard-timer", msg => {
        data.leaderboardTimer = msg.data.countDownSec; 
    }); 
    data.lobbyChannel.subscribe("new-leaderboard", msg => {
        data.isLastQuestion = msg.data.isLastQuestion; 
        data.leaderboard = msg.data.leaderboard; 
    }); 
    data.lobbyChannel.subscribe("next-question-timer", msg => {
        data.nextQuestionTimer = msg.data.countDownSec; 
    }); 
    data.lobbyChannel.subscribe("kill-lobby", msg => {
        data.gameKilled = true; 
    }); 

    // Set Up My Player
    data.myClientId = data.realtime.auth.clientId; 
    data.myPlayerCh = data.realtime.channels.get(
        `${data.lobbyId}:player-ch-${data.myClientId}`
    ); 

    /* ----------------------- */ 
    /* Player Action Functions */
    /* ----------------------- */  
    
    function toggleReady() {
        data.isReady = !data.isReady;
        if (data.myPlayerCh != null) {
            data.myPlayerCh.publish("toggle-ready", {
                ready: data.isReady
            }); 
        } else {
            console.log(data.myPlayerCh); 
        }
    }

    function answerQuestion(indexOfPicked) {
        data.playerAnswer = data.options[indexOfPicked]; 
        if (data.myPlayerCh != null) {
            data.myPlayerCh.publish("player-answer", {
                answerText: data.playerAnswer
            }); 
        } else {
            throw "Shouldn't be able to answer question before initializing player channel..";
        }
    }

    function displayLobbyDashboard() {
        // data.players.sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1);  
        if (Object.keys(data.players).length <= 0) {
            return; 
        }
        console.log(`Lobby Code: ${data.lobbyId}`); 
        console.log(`Studyset Loaded: ${data.curStudySetName}\n`); 
        console.log("  Players: "); 
        console.log("-----------------------------"); 
        for (const playerId in data.players) { 
            console.log("|  " + data.players[playerId].username.padEnd(13, " ") + 
                    (data.players[playerId].isHost ? "HOST" : "").padEnd(7, " ") + 
                    (data.players[playerId].isReady ? "R" : "").padEnd(3, " ") + "  |"); 
        }
        console.log("-----------------------------"); 
    }
    
    while (true) {
        let input = await testUtils.pauseForUserInput("Please press ENTER to continue..."); 
        switch (input) {
            case "r": 
                toggleReady();
                break;  
        }
    }
    
    // Close ABLY Realtime Connection
    data.realtime.connection.close(); 
}

let runPlayerSimulation = async function() {
    await simulatePlayer("player1"); 
}

runPlayerSimulation(); 

