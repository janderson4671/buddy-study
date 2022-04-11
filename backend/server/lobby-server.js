// Thread Business
const { parentPort, workerData } = require("worker_threads"); 
const lobbyId = workerData.lobbyId; 
const hostUsername = workerData.hostUsername; 
const hostClientId = workerData.hostClientId; 

// Packages
const mongoose = require("mongoose"); 
const Ably = require("ably/promises"); 

mongoose.connect('mongodb://localhost:27017/buddy-study', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}); 

// Imported models
const models = require("./models.js"); 
const StudySet = models.studysetModel; 
const FlashCard = models.flashcardModel; 

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
const Q_TIMER_SEC = 15; 
const LEADERBOARD_TIMER_SEC = 5; 
const NEXT_QUESTION_TIMER_SEC = 5;   
const SMALLEST_SET_ALLOWED = 4; 
const NUM_FAKE_ANSWERS = 3; 

// Channels
const playerChannels = {}; 
const globalPlayerStates = {}; 
 
let lobbyChannel; 
const lobbyChName = `${lobbyId}:primary`; 
const hostAdminChName = `${lobbyId}:host`; 
let hostAdminCh; 

let gameStarted = false; 
let curStudysetID = null; 
let curStudySetName = null; 
let totalPlayers = 0;
let readyCount = 0; 

let questionClosed = false; 
let questions = []; 
let curQuestionNum = 0; 
let playerAnswers = {}; 
let leaderboard = []; 

/* --- END Ably Context --- */ 

realtime.connection.once("connected", () => {
    hostAdminCh = realtime.channels.get(hostAdminChName); 
    lobbyChannel = realtime.channels.get(lobbyChName); 

    subscribeToHost(); 

    lobbyChannel.presence.subscribe("enter", handleNewPlayer); 
    lobbyChannel.presence.subscribe("leave", handlePlayerLeft); 
    lobbyChannel.publish("thread-ready", {start: true}); 
    lobbyChannel.publish("update-player-states", globalPlayerStates); 
})

function handleNewPlayer(player) {
    console.log(player.data.username + " joined the game!"); 
    const newPlayerId = player.clientId; 
    totalPlayers++; 
    parentPort.postMessage({
        lobbyId: lobbyId, 
        totalPlayers: totalPlayers, 
        gameStarted: gameStarted, 
    }); 

    let newPlayerState = {
        username: player.data.username, 
        isHost: player.data.isHost, 
        isReady: (player.data.isHost ? true : false),  
        score: 0
    }; 
    if (newPlayerState.isReady) {
        readyCount++; 
    }
    playerChannels[newPlayerId] = realtime.channels.get(
        `${lobbyId}:player-ch-${newPlayerId}`
    ); 
    subscribeToPlayer(playerChannels[newPlayerId], newPlayerId); 
    
    globalPlayerStates[newPlayerId] = newPlayerState; 
    lobbyChannel.publish("studyset-loaded", {
        studysetSubject: curStudySetName, 
        // studysetID: res.studysetID
    });  
    lobbyChannel.publish("update-player-states", globalPlayerStates); 
}

function handlePlayerLeft(player) {
    console.log(globalPlayerStates[player.clientId].username + " left the lobby"); 
    const leavingPlayerId = player.clientId;
    totalPlayers--; 
    parentPort.postMessage({
        lobbyId: lobbyId, 
        totalPlayers: totalPlayers, 
    }); 
    if (leavingPlayerId === hostClientId) {
        lobbyChannel.publish("kill-lobby", {}); 
        forceKillLobby(); 
    } else {
        if (globalPlayerStates[player.clientId].isReady) {
            readyCount--; 
        }
        delete globalPlayerStates[leavingPlayerId]; 
        lobbyChannel.publish("update-player-states", globalPlayerStates); 
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
        publish the first question */
        // console.log(`\nReady Count: ${readyCount}\n totalPlayers: ${totalPlayers}\n curStudySetID: ${curStudysetID}`); 
        if ((readyCount == totalPlayers) && (curStudysetID != null)) {
            readyCount = 1;
            for (const playerId in globalPlayerStates) {
                if (!globalPlayerStates[playerId].isHost) {
                    globalPlayerStates[playerId].isReady = false;  
                } else {
                    globalPlayerStates[playerId].isReady = true; 
                }
            }
            lobbyChannel.publish("update-player-states", globalPlayerStates); 
            curQuestionNum = 0; 
            gameStarted = true; 
            parentPort.postMessage({
                lobbyId: lobbyId, 
                gameStarted: gameStarted
            }); 
            await publishTimer("countdown-timer", START_TIMER_SEC); 
            runGame(); 
        }
    }); 

    hostAdminCh.subscribe("load-studyset", async (msg) => {
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
        const res = await getFlashcardsOfSet(msg.data.studysetID);
        if (res.success) {
            let allAnswers = []; 
            res.flashCards.forEach(card => {
                allAnswers.push(card.answerText); 
            }); 
            const answersLen = allAnswers.length; 
            
            questions = []; 
            let cardNum = 0; 
            res.flashCards.forEach(card => {
                let options = []; 
                for (let i = 0; i < NUM_FAKE_ANSWERS; i++) {
                    options.push(allAnswers[findFakeAnswerNum(answersLen, cardNum)]); 
                }
                options.splice(getRandomInt(NUM_FAKE_ANSWERS + 1), 0, card.answerText); 
                questions.push({
                    questionText: card.questionText,
                    answerText: card.answerText, 
                    options: options, 
                }); 
                cardNum++; 
            }); 
            curStudySetName = res.studysetSubject; 
            curStudysetID = res.studysetID; 
            lobbyChannel.publish("studyset-loaded", {
                studysetSubject: res.studysetSubject, 
                // studysetID: res.studysetID
            }); 
        }
    }); 

    hostAdminCh.subscribe("kill-lobby", () => {
        forceKillLobby(); 
    }); 
}

function subscribeToPlayer(playerChannel, playerId) {
    playerChannel.subscribe("player-answer", (msg) => {
        /*  if incorrect, don't even bother pushing --> 0
            Implement check if answer is correct, as well as timestamp
            can't change score until after all answers are received
            add {clientId : answerGiven} to answers{}  */
        if (!questionClosed) {
            playerAnswers[msg.clientId] = (msg.data.answerText 
                                        == questions[curQuestionNum].answerText)
        }
    }); 
    playerChannel.subscribe("toggle-ready", (msg) => {
        if (msg.data.ready) {
            readyCount++; 
        } else {
            readyCount--; 
        }
        globalPlayerStates[msg.clientId].isReady = msg.data.ready; 
        lobbyChannel.publish("update-readied", {
            playerId: msg.clientId, 
            isReady: msg.data.ready
        }); 

        /*  set ready variables (playerStates, readyCount, etc)
            publish new readied states to update-readied
        */ 
    })
}

function forceKillLobby() {
    lobbyChannel.publish("kill-lobby", {}); 
    killWorkerThread(); 
}

async function runGame() {
    while (true) {
        playerAnswers = {}
        questionClosed = false; 
        lobbyChannel.publish("new-question", {
            questionNumber: curQuestionNum + 1, 
            questionText: questions[curQuestionNum].questionText, 
            options: questions[curQuestionNum].options, 
        }); 
        await publishTimer("question-timer", Q_TIMER_SEC); 
        questionClosed = true; 
        lobbyChannel.publish("correct-answer", {
            questionNumber: curQuestionNum + 1, 
            answerText: questions[curQuestionNum].answerText
        });
        await Promise.all([publishTimer("leaderboard-timer", LEADERBOARD_TIMER_SEC), 
                            calculateResults()]);
        const isLastQuestion = (curQuestionNum == questions.length - 1); 
        lobbyChannel.publish("new-leaderboard", {
            isLastQuestion: isLastQuestion, 
            leaderboard: leaderboard, 
        }); 
        if (isLastQuestion) {
            break; 
        } else {
            curQuestionNum++; 
            await publishTimer("next-question-timer", NEXT_QUESTION_TIMER_SEC); 
        }
    }
}

function calculateResults() {
    /*
    playerAnswers: clientId: bool
    assign score depending on the number of answers and timestamp
    just do +1 correct, +0 incorrect for now... 
    need to update scores on player states 
    update leaderboard object
    */ 
    
    leaderboard = []
    Object.keys(globalPlayerStates).forEach(playerId => {
        if ((playerId in playerAnswers) && (playerAnswers[playerId])) {
            globalPlayerStates[playerId].score++; 
        }
        leaderboard.push({
            username: globalPlayerStates[playerId].username, 
            score: globalPlayerStates[playerId].score
        }); 
    }); 
    /*  ON THE FRONT END: (sort by greatest score then alphabetically)
        leaderboard.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1) : -1); 
    */ 
}

async function getFlashcardsOfSet(studysetID) {
    try {
        const studySet = await StudySet.findOne({
            studysetID: studysetID, 
        }); 
        if (!studySet) {
            return send({
                success: false, 
                message: "Study set not found..", 
            }); 
        }
        const flashCards = await FlashCard.find({
            studysetID: studySet.studysetID, 
        }); 
        if (flashCards.length < 4) {
            return {
                success: false, 
                message: "Not enough flashcards in set.."
            }; 
        }
        return {
            success: true, 
            studysetSubject: studySet.subject, 
            studysetID: studySet.studysetID, 
            flashCards: flashCards, 
        }; 
    } catch (error) {
        console.log(error); 
        return {
            success: false, 
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max); 
}

function findFakeAnswerNum(numAnswers, correctIndex) {
    let index = -1; 
    while (true) {
        index = getRandomInt(numAnswers); 
        if (index != correctIndex) {
            return index; 
        }
    }
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
