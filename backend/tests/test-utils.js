// Testing setup
const axios = require("axios"); 
const {response} = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
}); 
const readline = require("readline"); 

/************************** TESTING UTILITY METHODS ***************************/
module.exports = {
    pauseForUserInput: function(query) {
        const rl = readline.createInterface({
            input: process.stdin, 
            output: process.stdout, 
        }); 
        return new Promise(resolve => rl.question(query + "\n", ans => {
            rl.close(); 
            resolve(ans); 
        })); 
    },
    reportFailure: function(message) {
        console.error("ERROR: " + message);
    },
    reportSuccess: function(message) {
        console.log("SUCCESS: " + message);
    },
    assertNotNull: function(object) {
        if (object == null) {
            reportFailure("Response Object is Null!");
        }
    },
    clearUsers: async function() {
        try {
            let response = await api.get("/api/user/clear");
            if (!response.data.success) {
                throw "Clear User Database Failed!"
            }
        } catch (error) {
            reportFailure(error);
            process.exit(1);
        }
        
    },
    clearStudySets: async function() {
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
        
    },
    clearFlashcards: async function() {
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
}
/******************************************************************************/
