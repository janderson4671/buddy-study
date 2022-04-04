// Testing setup
const axios = require("axios"); 
const {response} = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
}); 
const Ably = require("ably"); 
const readline = require("readline"); 
const testUtils = require("./test-utils"); 


/************************** GAME TESTS ***************************/

let simulateHost = async function simulateHost() {
    let hostRegisterRequest = {
        username: "host123", 
        password: "password", 
        email: "host_email@email.com"
    }

    let createStudySetRequest = {
        username: "host123", 
        subject: "Geography"
    }

    let createFlashRequest_1 = {
        studysetID: null, 
        questionText: "What country is Beijing in?", 
        answerText: "China"
    }

    let createFlashRequest_2 = {
        studysetID: null, 
        questionText: "What is the capital of Thailand?", 
        answerText: "Bangkok"
    }

    let createFlashRequest_3 = {
        studysetID: null, 
        questionText: "What is the most beautiful country in the world?", 
        answerText: "Scotland"
    }

    let createFlashRequest_4 = {
        studysetID: null, 
        questionText: "What is the earth's largest continent?", 
        answerText: "Asia"
    }

    let createFlashRequest_5 = {
        studysetID: null, 
        questionText: "What razor-thin country accounts for more than half of the western coastlin of South America?", 
        answerText: "Chile"
    }
    let createFlashRequest_6 = {
        studysetID: null, 
        questionText: "What river runs through Baghdad?", 
        answerText: "Tigris"
    }

    let createFlashRequest_7 = {
        studysetID: null, 
        questionText: "What country has the most natural lakes?", 
        answerText: "Canada"
    }

    let createLobbyRequest = {
        username: "host123", 
    }

    data = {
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
        questionAnswered: false, 

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

    // LOOK AT WHAT YOU HAVE IN HOST.JS, might help

    /*  List of Tasks:
    
    - REST API call to /api/game/newlobby, get lobbyId
    - enter the globalChannel with username and lobbyId
        - this should cause lobby thread to be created
        - add some print statements in lobby thread to 
          verify that the lobby has actually been created
    */ 

    // Register the host
    try {
        let res = await api.post("/api/user/register", hostRegisterRequest); 
        
        testUtils.assertNotNull(res); 

        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to register the host";
        }

        testUtils.reportSuccess("Host Successfully Registered"); 
    } catch (error) {
        testUtils.reportFailure(error); 
        process.exit(1); 
    }

    // Add a studyset
    try {
        let res = await api.post("/api/studyset/create", createStudySetRequest); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's studyset"
        } else {
            data.chosenStudySet = res.data.studysetID; 
            createFlashRequest_1.studysetID = data.chosenStudySet; 
            createFlashRequest_2.studysetID = data.chosenStudySet; 
            createFlashRequest_3.studysetID = data.chosenStudySet; 
            createFlashRequest_4.studysetID = data.chosenStudySet; 
            createFlashRequest_5.studysetID = data.chosenStudySet; 
            createFlashRequest_6.studysetID = data.chosenStudySet; 
            createFlashRequest_7.studysetID = data.chosenStudySet; 

        }
    } catch (error) {
        testUtils.reportFailure(error); 
        process.exit(1); 
    }

    // Add a few flashcards 
    try {
        let res = await api.post("/api/flashcard/create", createFlashRequest_1); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 1"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_2); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 2"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_3); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 3"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_4); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 4"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_5); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 5"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_6); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 6"
        }

        res = await api.post("/api/flashcard/create", createFlashRequest_7); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to create the host's flashcard 7"
        }
    } catch (error) {
        testUtils.reportFailure(error); 
        process.exit(1); 
    }

    // Get a Lobby ID
    try {
        let res = await api.get("/api/game/newlobby" + "?username=" + data.username); 
        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Create Lobby Failed - marked unsuccessful";
        }
        if (res.data.lobbyId == null) {
            throw "Create Lobby Failed - lobbyId is null"
        } 
        data.lobbyId = res.data.lobbyId; 
        testUtils.reportSuccess("Lobby created -- ID received"); 
    } catch (error) {
        testUtils.reportFailure(error); 
        process.exit(1); 
    }

    // Initialize Lobby and Admin Channels
    data.lobbyChannel = data.realtime.channels.get(
        `${data.lobbyId}:primary`
    ); 
    data.hostAdminCh = data.realtime.channels.get(
        `${data.lobbyId}:host`
    ); 

    // Once thread is prepared we can subscribe to the lobby
    data.lobbyChannel.subscribe("thread-ready", () => {
        // Handle Lobby Prepared
        data.lobbyReady = true; 
        data.globalChannel.detach(); 

        // Enter Lobby
        data.lobbyChannel.presence.enter({
            username: data.username, 
            isHost: true, 
        }); 
        
        // Subscribe to Lobby Channels
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
            console.log(data.countdownTimer); 
        }); 
        data.lobbyChannel.subscribe("new-question", msg => {
            data.questionAnswered = false; 
            data.playerAnswer = null; 
            console.log(msg.data); 
            data.qNum = msg.data.questionNumber; 
            data.qText = msg.data.questionText; 
            data.options = msg.data.options;
            console.log(`${data.qNum}: ${data.qText}\n`); 
            data.options.forEach((option, index) => {
                console.log(`${index}: ${option}`)
            }) 
        }); 
        data.lobbyChannel.subscribe("question-timer", msg => {
            data.qTimer = msg.data.countDownSec; 
            console.log(data.qTimer); 
        }); 
        data.lobbyChannel.subscribe("correct-answer", msg => {
            data.correctAnswer = msg.data.answerText; 
            console.log(`Correct answer: ${data.correctAnswer}`); 
            console.log((data.playerAnswer != null 
                        && data.correctAnswer == data.playerAnswer) ? 
                                                                        "I was right!" : 
                                                                        `I missed this one... Submitted ${data.playerAnswer}, ${data.correctAnswer} was correct`); 
        }); 
        data.lobbyChannel.subscribe("leaderboard-timer", msg => {
            data.leaderboardTimer = msg.data.countDownSec; 
            console.log(data.leaderboardTimer); 
        }); 
        data.lobbyChannel.subscribe("new-leaderboard", msg => {
            data.isLastQuestion = msg.data.isLastQuestion; 
            data.leaderboard = msg.data.leaderboard; 
            data.leaderboard.forEach(entry => {
                console.log("-------------------------"); 
                console.log("|  " + entry.username.padEnd(13, " ") + 
                    (`${entry.score}`).padEnd(6, " ") + "  |"); 
                console.log("-------------------------"); 
            });
        }); 
        data.lobbyChannel.subscribe("next-question-timer", msg => {
            data.nextQuestionTimer = msg.data.countDownSec; 
            console.log(data.nextQuestionTimer);
        }); 
        data.lobbyChannel.subscribe("kill-lobby", msg => {
            data.gameKilled = true; 
        }); 

        // Set up my Player
        data.myClientId = data.realtime.auth.clientId; 
        data.myPlayerCh = data.realtime.channels.get(
            `${data.lobbyId}:player-ch-${data.myClientId}`
        ); 
    }); 

    // Enter Main Thread
    data.globalChannel = data.realtime.channels.get(data.globalChannelChName); 
    data.globalChannel.presence.enter({
        username: data.username, 
        lobbyId: data.lobbyId
    }); 

    /* ----------------------- */ 
    /* Player Action Functions */
    /* ----------------------- */ 
 
    function toggleReady() {
        data.isReady = !data.isReady;
        if (data.myPlayerCh != null) {
            data.myPlayerCh.publish("toggle-ready", {
                ready: data.isReady
            }); 
        }
    }

    function answerQuestion(indexOfPicked) {
        data.questionAnswered = true; 
        data.playerAnswer = data.options[indexOfPicked]; 
        if (data.myPlayerCh != null) {
            data.myPlayerCh.publish("player-answer", {
                answerText: data.playerAnswer
            }); 
        } else {
            throw "Shouldn't be able to answer question before initializing player channel..";
        }
    }

    function selectStudyset() {
        data.hostAdminCh.publish("load-studyset", {
            studysetID: data.chosenStudySet
        }); 
    }

    function startGame() {
        data.hostAdminCh.publish("start-game", {} ); 
    }

    /* ------------- */ 
    /* GUI Functions */
    /* ------------- */

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
        let quit = false; 
        switch (input) {
            case "q": 
                quit = true; 
                break; 
            case "load":
                selectStudyset(); 
                break;
            case "start": 
                startGame(); 
                break;
            default: 
                // Answering Question
                if (!data.questionAnswered) {
                    console.log(`Answer submitted: ${input}`); 
                    answerQuestion(input); 
                }
        }
        if (quit) {
            break; 
        }
    }


    
    // Close ABLY Realtime Connection
    data.realtime.connection.close(); 
} 

let runHostSimulation = async function() {
    // Clear entire local database
    await testUtils.clearUsers(); 
    await testUtils.clearStudySets(); 
    await testUtils.clearFlashcards(); 

    await simulateHost(); 
}

runHostSimulation();
