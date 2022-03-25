// Testing setup
const axios = require("axios"); 
const {response} = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
}); 
const Ably = require("ably"); 
let realtime = null; 

/************************** TESTING UTILITY METHODS ***************************/
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

let hostTests = async function hostTests() {

    console.log("\n -------------------- BEGIN GAME TESTS -------------------- \n");

    // Clear entire local database
    await clearUsers(); 
    await clearStudySets(); 
    await clearFlashcards(); 

    let realtime = null; 

    // Open ABLY Realtime Connection
    try {
        realtime = await Ably.Realtime({
            authUrl: "http://localhost:3000/api/game/auth"
        });
    } catch (error) {
        reportFailure(error); 
        process.exit(1); 
    }

    // LOOK AT WHAT YOU HAVE IN HOST.JS, might help

    /*  List of Tasks:
    
    - REST API call to /api/game/newlobby, get lobbyId
    - enter the globalChannel with username and lobbyId
        - this should cause lobby thread to be created
        - add some print statements in lobby thread to 
          verify
     








    */ 

    // Close ABLY Realtime Connection
    realtime.connection.close(); 
} 

let tests = async function() {
    await hostTests(); 
}

tests();
