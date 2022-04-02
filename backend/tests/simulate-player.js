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
            break; 
        } 
    }

    // TODO: Add subscriptions, enter lobby channel, create myPlayerCh, etc. 
    

    
    
    // Close ABLY Realtime Connection
    data.realtime.connection.close(); 
}

let runPlayerSimulation = async function() {
    await simulatePlayer("player1"); 
}

runPlayerSimulation(); 

