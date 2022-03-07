// Testing setup
const axios = require("axios"); 
const {response} = require("express"); 
const api = axios.create({
    baseURL : "http://localhost:3001"
}); 

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
        let response = await api.get("/api/database/clearUsers");
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
        let response = await api.get("/api/database/clearStudySets");
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
        let response = await api.get("/api/database/clearFlashcards");
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


/************************** GAME API TESTS ***************************/

let createGameTests = async function createGameTests() {
    console.log("\n -------------------- BEGIN CREATE GAME TESTS -------------------- \n");

    let validCreateGameRequest = {
        username: "person123", 
        studysetID: "12345", 
    }; 
    
    try {
        var response = await api.post("/api/game/create", validCreateGameRequest); 
        
        assertNotNull(response); 

        if (response.data.success) {
            console.log("lobbyID: " + response.data.lobbyID); 
        } else {
            console.log("Error Message: " + response.data.message); 
            throw "Create game failed when it should not have";
        } 
    } catch (error) {
        reportFailure(error); 
        process.exit(1); 
    }
}

let tests = async function() {
    await createGameTests(); 
}

tests(); 