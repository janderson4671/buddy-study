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

/************************** SET UP TESTS ***************************/

let setUpTests = async function setUpTests() {

    console.log("\n -------------------- BEGIN SET UP TESTS -------------------- \n");

    // Clear entire local database
    await clearUsers(); 
    await clearStudySets(); 
    await clearFlashcards(); 

    // Connect to ABLY Realtime instance
    try {
        let realtime = await Ably.Realtime({
            authUrl: "http://localhost:3000/api/game/auth"
        }); 
        console.log("1" + (realtime == null ? true : false)); 
    } catch (error) {
        reportFailure(error); 
        process.exit(1); 
    }
    console.log("2" + (realtime == null ? true : false)); 
} 

let tests = async function() {
    await setUpTests(); 
}

tests();
console.log("3" + (realtime == null ? true : false)); 
// realtime.connection.close(); 