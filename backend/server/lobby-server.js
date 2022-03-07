// Thread Business
const { parentPort, workerData } = require("worker_threads"); 
const lobbyId = workerData.lobbyId; 
const hostUsername = workerData.hostUsername; 
const hostClientId = workerData.hostClientId; 

// Packages
const mongoose = require("mongoose"); 
const Ably = require("ably/promises"); 

// Imported models
const models = require("./models.js"); 
const StudySet = models.studysetModel; 

// Ably set-up
const ABLY_API_KEY = process.env.ABLY_API_KEY; 
const realtime = Ably.Realtime({
    key: ABLY_API_KEY, 
    echoMessage: false, 
});

/* --- BEGIN Ably Context --- */ 

// Constants (all are arbitrary for now)
const MIN_PLAYERS_TO_START_GAME = 2;  
const GAME_ROOM_CAPACITY = 2; 
const START_TIMER_SEC = 10; 
const Q_TIMER_SEC = 7; 

// Channels

const playerChannels = {}; 
const globalPlayerState = {}; 
 
let lobbyChannel; 
const lobbyChName = `${lobbyId}:primary`; 
const hostAdminChName = `${lobbyId}:host`; 
let hostAdminCh; 

let gameStarted = false; 
let totalPlayers = 1;

let questions = []; 
let answers = []; 

/* --- END Ably Context --- */ 

realtime.connection.once("connected", () => {
    hostAdminCh = realtime.channels.get(hostAdminChName); 
    lobbyChannel = realtime.channels.get(lobbyChName); 

    subscribeToHost(); 

    lobbyChannel.presence.subscribe("enter", handleNewPlayer); 
    lobbyChannel.presence.subscribe("leave", handlePlayerLeft); 
    lobbyChannel.publish("thread-ready", {start: true}); 
})

function handleNewPlayer(player) {
    console.log(player.date.username + " joined the game!"); 
    const newPlayerId = player.clientId; 
    totalPlayers++; 
    parentPort.postMessage({
        lobbyId: lobbyId, 
        totalPlayers: totalPlayers, 
        gameStarted: gameStarted, 
    }); 

    let newPlayerState = {
        id: newPlayerId, 
        username: player.data.username, 
        isHost: player.data.isHost, 
        score: 0
    }; 
    
    playerChannels[newPlayerId] = realtime.channels.get(
        `${lobbyId}:player-ch-${newPlayerId}`
    ); 

    subscribeToPlayer(playerChannels[newPlayerId], newPlayerId); 
    
    globalPlayerState[newPlayerId] = newPlayerState;  
    lobbyChannel.publish("new-player", {
        newPlayerState
    }); 
}

function handlePlayerLeft(player) {
    console.log(player.clientId + " left the lobby"); 
    const leavingPlayerId = player.clientId;
    totalPlayers--; 
    parentPort.postMessage({
        lobbyId: lobbyId, 
        totalPlayers: totalPlayers, 
    }); 
    delete globalPlayerState[leavingPlayerId]; 
    if (leavingPlayerId === hostClientId) {
        lobbyChannel.publish("host-left", {
            killLobby: true, 
        }); 
        forceKillLobby(); 
    }
}

async function publishTimer(event, countDownSec) {
    while (countDownSec > 0) {
        lobbyChannel.publish(event, {
            countDownSec: countDownSec
        }); 
        await new Promise((resolve) => setTimeout(resolve, 1000));
        countDownSec -= 1; 
        // if (event === "question-timer" && skipTimer) break;  
    }
}

function subscribeToHost() {
    hostAdminCh.subscribe("start-game", async () => {
        /* 
        if all players ready, 
            gameStarted = true
            parentPort.postMessage({
                lobbyId, 
                gameStarted
            }); 
            await publishTimer("start-quiz-timer", START_TIMER_SEC); 
            publish the first question
        */ 
    }); 

    hostAdminCh.subscribe("load-studyset", (msg) => {
        /*
        get studyset from database
        if failure, don't change current questions[]
        if success, questions = empty list
        iterate over flashcards, create question objects for them
        include: 
            - questionText
            - answerText
            - 3 options from other questions! (algorithm to get 3 fakes)
            - 1 correct option
        push all questions to new question[] list
        */ 
    }); 

    hostAdminCh.subscribe("kill-lobby", () => {
        forceKillLobby(); 
    }); 
}

function subscribeToPlayer(playerChannel, playerId) {
    playerChannels.subscribe("player-answer", (msg) => {
        // if incorrect, don't even bother pushing --> 0
        // Implement check if answer is c'lnipJorrect, as well as timestamp
        // can't change score until after all answers are received
        // push answer to answers[], as pair {clientId, answerGiven}
    }); 
}

function forceKillLobby() {
    lobbyChannel.publish("kill-lobby", {
        killLobby: true
    }); 
    killWorkerThread(); 
}

async function publishQuestion(qIndex) {
    answers = []
    await lobbyChannel.publish("new-question", {
        numAnswered: 0, 
        numPlaying: totalPlayers, 
        questionNumber: qIndex + 1, 
        questionText: questions[qIndex].questionText, 
        choices: questions[qIndex].choices, 
    }); 
    await publishTimer("question-timer", Q_TIMER_SEC); 
    await lobbyChannel.publish("correct-answer", {
        questionNumber: qIndex + 1, 
        answerText: questions[qIndex].answerText
    });
}

function calculateResults() {
    /*
    answers should now be == to totalPlayers depending on implementation, 
    either "" is submitted at end of timer or no answer is submitted. 
    I'm not sure which to do yet... 

    assign score depending on the number of answers and timestamp
    sort by latest timestamp first!! 
    score = totalPlayers - len(answers) + index
        e.g. 4 players, 2 answered correctly. 
        score = 4 - 2 + 0 for low score -> 2
        score = 4 - 2 + 1 for higher score -> 3
        and so up the line
    need to update scores on player states
    publish player states so score is updated, then show leaderboard
    */ 
}

function killWorkerThread() {
    console.log("Killing thread"); 
    for (const item in playerChannels) {
        if (playerChannels[item]) {
            playerChannels[item].detach(); 
        }
    }
    hostAdminCh.detach(); 
    lobbyChannel.detach(); 
    parentPort.postMessage({
        killWorker: true, 
        lobbyId: lobbyId, 
        totalPlayers: totalPlayers
    }); 
    process.exit(0); 
}



