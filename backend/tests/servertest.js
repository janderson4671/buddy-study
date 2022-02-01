// Testing setup
const axios = require("axios");
const api = axios.create({
    baseURL : "http://localhost:3000"
});

const readline = require("readline");
const consoleInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
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
    let response = await api.get("/api/database/clearUsers");
    if (!response.data.success) {
        throw "Clear User Database Failed!"
    }
}
/******************************************************************************/


/************************** REGISTER API TESTS ***************************/
let registerTests = async function registerTests() {
    let validRegisterRequest = {
        username : "person123",
        password : "password",
        email : "randomemail@email.com"
    }
    
    let invalidRegisterRequest = {
        username : null,
        password : "password",
        email : null
    }

    // Clear the User Database
    await clearUsers();
    
    // Test Valid Register API call
    try {
        let response = await api.post("/api/user/register", validRegisterRequest);
    
        assertNotNull(response);
    
        if (!response.data.success) {
            throw "Register service failed when it should not have";
        }
        if (response.data.username !== validRegisterRequest.username) {
            throw "Response username does not match request username";
        }

        // Passed this test!
        reportSuccess("Valid Register Passed");
    } catch (error) {
        reportFailure(error)
    }
    
    // Test Invalid Register API Call
    try {
        response = await api.post("/api/user/register", invalidRegisterRequest);
        assertNotNull(response);
    
        if (response.data.success) {
            throw "Invalid register was successful when it should not have";
        }

        // Passed this test!
        reportSuccess("Invalid Register Passed");
    } catch (error) {
        reportFailure(error);
    }
}




/***************************** Run Tests ********************************/

// MAKE SURE THAT THE DATABASE URL IS "mongodb://localhost:27017/buddy-study-test"

// Comment out any tests that you do not need running
registerTests();