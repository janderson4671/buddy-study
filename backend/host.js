// Must include on main page once logged in! (not before)
// (should get an authtoken for username as soon as logged in)
import * as Ably from "ably"; 

this.realtime = new WebAssembly.Realtime({
    authUrl: "/auth" // probably need to put full URL here 
}); 

// For destructor: 
this.realtime.connection.close();

// DATA / VARIABLES
data = {
    username: "should know this after logged in...", 
    
    globalChannelChName: "main-game-thread", 
    globalChannel: null, 
    lobbyId: null, 
    hostAdminCh: null, 
    lobbyChannel: null,
    lobbyReady: false,  
    studyset: null, 
    // ... 
}

// METHODS
function createLobby() {
    /* 
    run axios call to /api/game/newlobby
    this should return a lobbyId
    */
    this.lobbyChannel = this.realtime.channels.get(
        `${this.lobbyId}:primary`
    );
    this.hostAdminCh = this.realtime.channels.get(
        `${this.lobbyId}:host`
    ); 
    this.lobbyChannel.subscribe("thread-ready", () => {
        this.handleLobbyPrepared(); 
    }); 
}

function handleLobbyPrepared() {
    this.lobbyReady = true; 
    this.globalChannel.detach(); 
    this.enterLobby(); 
}

function enterLobby() {
    this.lobbyChannel.presence.enter({
        username: username, 
        isHost: true, 
    }); 
    this.subscribeToLobby(); 
}

function subscribeToLobby() {
    this.lobbyChannel.subscribe("start-game-timer", msg => {
        this.gameStarted = true; 
        this.timer = msg.data.countDownSec; 
    }); 
    this.lobbyChannel.subscribe("new-question", msg => {
        this.handleNewQuestion(msg); 
    }); 
    this.lobbyChannel.subscribe("question-timer", msg => {
        this.questionTimer = msg.data.countDownSec; 
        if (this.questionTimer < 0) {
            this.questionTimer = 30; 
        }
    }); 
}

