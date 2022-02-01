// Testing setup
const axios = require("axios");
const { response } = require("express");
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

    console.log("\n -------------------- BEGIN USER REGISTER TESTS -------------------- \n");

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
        var response = await api.post("/api/user/register", validRegisterRequest);
    
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
        reportFailure(error);
        process.exit(1);
    }

    // Test Duplicate Username
    try {
        response = await api.post("/api/user/register", validRegisterRequest);

        assertNotNull(response);

        if (response.data.success) {
            throw "Duplicate Username was allowed to register to system"
        }

        // Passed this test
        reportSuccess("Duplicate Username Passed")
    } catch (error) {
        reportFailure(error);
        process.exit(1);
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
        process.exit(1);
    }
}

/************************** LOGIN API TESTS ***************************/
let loginTests = async function loginTests() {
    console.log("\n -------------------- BEGIN USER LOGIN TESTS -------------------- \n");

    let registerRequest = {
        username : "person123",
        password : "password",
        email : "randomemail@email.com"
    }

    let validLoginRequest = {
        username : "person123",
        password : "password",
    }

    let notUserInSystemLoginRequest = {
        username : "dontexist",
        password : "password",
    }

    let wrongPasswordRequest = {
        username : "person123",
        password : "wordpass",
    }
    
    let invalidUsernameRequest = {
        username : null,
        password : "password",
    }

    let invalidPasswordRequest = {
        username : "person123",
        password : null,
    }

    // Clear the User database and register a single user
    await clearUsers();
    var response = api.post("/api/user/register", registerRequest);

    // Valid Login Test
    try {
        response = api.post("/api/user/login", validLoginRequest);
        assertNotNull(response);

        if (!response.data.success) {
            throw "Login was unsuccessful when given valid login";
        }
        if (response.data.username !== validLoginRequest.username) {
            throw "Response username does not match request username";
        }

        reportSuccess("Passed Valid Login")
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // User is not registered Test
    try {
        response = api.post("/api/user/login", notUserInSystemLoginRequest);
        assertNotNull(response);

        if (response.data.success) {
            throw "Login was successful for a user that does not exist";
        }

        reportSuccess("Passed Non-Registered User Login");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // Wrong Password Test
    try {
        response = api.post("/api/user/login", wrongPasswordRequest);
        assertNotNull(response);

        if (response.data.success) {
            throw "Login was successful with incorrect password";
        }

        reportSuccess("Passed Wrong Password Login");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // Null Username and Password Login Tests
    try {
        response = api.post("/api/user/login", invalidUsernameRequest);
        assertNotNull(response);

        if (response.data.success) {
            throw "Login was successful with null Username";
        }

        response = api.post("/api/user/login", invalidPasswordRequest);
        assertNotNull(response);

        if (response.data.success) {
            throw "Login was successful with null Password";
        }

        reportSuccess("Passed Null Username and Password Test");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }
}


/***************************** Run Tests ********************************/

// MAKE SURE THAT THE DATABASE URL IS "mongodb://localhost:27017/buddy-study-test"

// Comment out any tests that you do not need running
// registerTests();
loginTests();