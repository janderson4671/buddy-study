// Testing setup
const axios = require("axios"); 
const {response} = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
}); 
const Ably = require("ably"); 
const readline = require("readline"); 

/************************** TESTING UTILITY METHODS ***************************/
function pauseForUserInput(query) {
    const rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout, 
    }); 
    return new Promise(resolve => rl.question(query, ans => {
        rl.close(); 
        resolve(ans); 
    })); 
}

let reportFailure = function(message) {
    console.error("ERROR: " + message);
}
let reportSuccess = function(message) {
    console.log("SUCCESS: " + message);
}
let assertNotNull = function(object) {
    if (object == null) {
        reportFailure("Response Object is Null!");
    }
}

let clearUsers = async function() {
    try {
        let response = await api.get("/api/user/clear");
        if (!response.data.success) {
            throw "Clear User Database Failed!"
        }
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }
    
}

let clearStudySets = async function() {
    try {
        let response = await api.get("/api/studyset/clear");
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Clear StudySet Database Failed!"
        }
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }
    
}

let clearFlashcards = async function() {
    try {
        let response = await api.get("/api/flashcard/clear");
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Clear Flashcard Database Failed!"
        }
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }
}
/******************************************************************************/

/************************** GAME TESTS ***************************/

let hostRegisterRequest = {
    username: "person123", 
    password: "password", 
    email: "randomemail@email.com"
}

let createLobbyRequest = {
    username: "person123"
}


let hostTests = async function hostTests() {
    data = {
        realtime: null, 
        username: "person123", 
        globalChannelChName: "main-game-thread", 
        globalChannel: null, 
        lobbyId: null, 
        hostAdminCh: null, 
        lobbyChannel: null, 
        lobbyReady: false, 
    }
    console.log("\n -------------------- BEGIN GAME TESTS -------------------- \n");

    // Clear entire local database
    await clearUsers(); 
    await clearStudySets(); 
    await clearFlashcards(); 

    // Open ABLY Realtime Connection
    try {
        data.realtime = await Ably.Realtime({
            authUrl: "http://localhost:3000/api/game/auth"
        });
    } catch (error) {
        reportFailure(error); 
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
        
        assertNotNull(res); 

        if (!res.data.success) {
            console.log("Error Message: " + res.data.message); 
            throw "Failed to register the host";
        }

        reportSuccess("Host Successfully Registered"); 
    } catch (error) {
        reportFailure(error); 
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
        reportSuccess("Lobby created -- ID received"); 
    } catch (error) {
        reportFailure(error); 
        process.exit(1); 
    }

    // Initialize Lobby and Admin Channels
    data.lobbyChannel = data.realtime.channels.get(
        `${data.lobbyId}:primary`
    ); 
    data.hostAdminCh = data.realtime.channels.get(
        `${data.lobbyId}:host`
    ); 

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
        // data.lobbyChannel.subscribe() ... 
    })

    // Enter Main Thread
    data.globalChannel = data.realtime.channels.get(data.globalChannelChName); 
    data.globalChannel.presence.enter({
        username: data.username, 
        lobbyId: data.lobbyId
    }); 

    await pauseForUserInput("Please press ENTER to continue..."); 
    // Close ABLY Realtime Connection
    data.realtime.connection.close(); 
} 

let tests = async function() {
    await hostTests(); 
}

tests();
