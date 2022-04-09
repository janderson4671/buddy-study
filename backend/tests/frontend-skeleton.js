/* ************* */ 
/* ALL VARIABLES */ 
/* ************* */ 

global_view = {
    /* --- Host Base Variables --- */ 
    hostAdminCh: null, 
    lobbyReady: false, 
    chosenStudySet: null, 

    /* --- Normal Player Base Variables --- */ 
    realtime: null, 
    username: null, 
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
}

/* --- In-Game Variables --- */ 

countdown_view = {
    // Game Countdown View
    countdownTimer: 0, 
}

question_view = {
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
}

leaderboard_view = {
    // Leaderboard View
    isLastQuestion: false, 
    leaderboard: null, 
    nextQuestionTimer: 0, 
    playAgainSelected: false, 
    quitSelected: false, 
}

/* ******************* */ 
/* ALL INITIALIZATIONS */ 
/* ******************* */ 

/* Initialize when ... */ 

// On navigating to the game page
global_view.realtime = await Ably.Realtime({
    authUrl: "http://localhost:3000/api/game/auth"
});

// GETTING THE LOBBY ID AND SETTING UP LOBBY

/* *********************** */ 
/* ON-CLICK - CREATE LOBBY */ 
/* *********************** */ 
// ------------------------------------------------------------------------------
global_view.isHost = true; 
let res = await api.get("/api/game/newlobby" + "?username=" + data.username); 
global_view.lobbyId = res.data.lobbyId; 
global_view.hostAdminCh = global_view.realtime.channels.get(
    `${global_view.lobbyId}:host`
); 
// Once thread is prepared we can subscribe to the lobby
global_view.lobbyChannel.subscribe("thread-ready", () => {
    // Handle Lobby Prepared
    global_view.lobbyReady = true; 
    global_view.globalChannel = detach(); 

    // Enter Lobby
    global_view.lobbyChannel.presence.enter({
        username: global_view.username, 
        isHost: true,
    }); 

    // Subscribe to Lobby Channels
    global_view.lobbyChannel.subscribe("update-player-states", msg => {
        global_view.players = msg.data; 
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
}); 
// Enter Main Thread
global_view.globalChannel = global_view.realtime.channels.get(global_view.globalChannelChName); 
global_view.globalChannel.presence.enter({
    username: data.username, 
    lobbyId: data.lobbyId
}); 
// ------------------------------------------------------------------------------






/* *********************** */ 
/* ON-CLICK - JOIN LOBBY */ 
/* *********************** */
// ------------------------------------------------------------------------------
/* Helper Function */ 
async function isLobbyEmpty() { 
    let promise = await new Promise((resolve, reject) => {
        global_view.lobbyChannel.presence.get((err, players) => {
            resolve(err || players.length < 1); 
        }); 
    })
    .catch(err => {throw err}); 

    return promise; 
}
global_view.isHost = false; 
global_view.lobbyChannel = global_view.realtime.channels.get(
    `${input}:primary`
); 
if (!(await isLobbyEmpty())) {
    global_view.lobbyId = input; // The variable input here is whatever code was entered
} else {
    global_view.lobbyChannel = null; 
}
// ------------------------------------------------------------------------------

/* ********** */ 
/* LISTENERS! */ 
/* ********** */

/* *********************** ** */ 
/* Host Option: Load Studyset */ 
/* ************************** */

// Called after studyset is selected
function loadStudyset() {
    global_view.hostAdminCh.publish("load-studyset", {
        studysetID: global_view.chosenStudySet 
        /*  "chosenStudySet" should be hooked up to whatever mechanism 
            selects the studyset on the front end. This function should 
            be called when that mechanism finishes selecting the studySet.  */ 
    }); 
}

/* *********************** */ 
/* Host Button: Start Game */ 
/* *********************** */

// Button Listener
function startGame() {
    if (!global_view.gameStarted) {
        global_view.hostAdminCh.publish("start-game", {} ); 
    }
}

/* ******************************** */ 
/* Non-host Button: Ready / Unready */ 
/* ******************************** */

// Button Listener
function toggleReady() {
    global_view.isReady = !global_view.isReady; 
    global_view.myPlayerCh.publish("toggle-ready", {
        ready: global_view.isReady 
    }); 
}

/* **************************************** */ 
/* Host + Non-host Game Buttons / Functions */ 
/* **************************************** */

// Listener for picking answer buttons --> 0,1,2,3 are possible inputs
function answerQuestion(indexOfPicked) {
    question_view.questionAnswered = true; 
    question_view.playerAnswer = question_view.options[indexOfPicked]; 
    global_view.myPlayerCh.publish("player-answer", {
        answerText: question_view.playerAnswer
    }); 
}

// Listener for "Exit to lobby?" button (only shows on leaderboard_view.isLastQuestion)
// --> navigate back to lobby component

// Listener for "Play Again?" button (only shows on leaderboard_view.isLastQuestion)
    data.myPlayerCh.detach()
    data.lobbyChannel.detach(); 
    // --> navigate back to main join game / create lobby component



/* ON DESTRUCT (WHEN NAVIGATING TO A DIFFERENT TAB OTHER THAN GAME) */ 
data.realtime.connection.close(); 

// onMount
// onDestroy
