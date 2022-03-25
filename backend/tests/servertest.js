// Testing setup
const axios = require("axios");
const { response } = require("express");
const api = axios.create({
    baseURL : "http://localhost:3000"
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
            console.log("Error Message: " + response.data.message); 
            throw "Register service failed when it should not have";
        }
        if (response.data.username !== validRegisterRequest.username) {
            console.log("Error Message: " + response.data.message); 
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
            console.log("Error Message: " + response.data.message); 
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
            console.log("Error Message: " + response.data.message); 
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
    console.log("\n --------------------- BEGIN USER LOGIN TESTS --------------------- \n");

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
    var response = await api.post("/api/user/register", registerRequest);

    // Valid Login Test
    try {
        response = await api.post("/api/user/login", validLoginRequest);
        assertNotNull(response);

        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Login was unsuccessful when given valid login";
        }
        if (response.data.username !== validLoginRequest.username) {
            console.log("Error Message: " + response.data.message); 
            throw "Response username does not match request username";
        }

        reportSuccess("Passed Valid Login")
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // User is not registered Test
    try {
        response = await api.post("/api/user/login", notUserInSystemLoginRequest);
        assertNotNull(response);

        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Login was successful for a user that does not exist";
        }

        reportSuccess("Passed Non-Registered User Login");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // Wrong Password Test
    try {
        response = await api.post("/api/user/login", wrongPasswordRequest);
        assertNotNull(response);

        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Login was successful with incorrect password";
        }

        reportSuccess("Passed Wrong Password Login");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }

    // Null Username and Password Login Tests
    try {
        response = await api.post("/api/user/login", invalidUsernameRequest);
        assertNotNull(response);

        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Login was successful with null Username";
        }

        response = await api.post("/api/user/login", invalidPasswordRequest);
        assertNotNull(response);

        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Login was successful with null Password";
        }

        reportSuccess("Passed Null Username and Password Test");
    } catch (error) {
        reportFailure(error);
        process.exit(1);
    }
}

/************************** USER DELETE TESTS ***************************/
let userDeleteTests = async function userDeleteTests() {

    console.log("\n --------------------- BEGIN USER DELETE TESTS --------------------- \n");

    let registerRequest = {
        username: "person123",
        password: "password",
        email: "randomemail@email.com"
    }
    let validDeleteRequest = {
        username: "person123",
        password: "password"
    }
    let wrongPasswordRequest = {
        username: "person123",
        password: "wordpass"
    }
    let invalidUsernameRequest = {
        username: null,
        password: "password"
    }
    let invalidPasswordRequest = {
        username: "person123",
        password: null
    }

    // Clear user database and register test user
    await clearUsers();
    var response = await api.post("/api/user/register", registerRequest);

    // Invalid Delete Requests
    try {
        response = await api.post("/api/user/delete", invalidUsernameRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid Delete with null username";
        }

        response = await api.post("/api/user/delete", invalidPasswordRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid Delete with null password";
        }

        reportSuccess("Passed Invalid Delete Request Tests");
    } catch (error) {
        reportFailure(error);
    }

    // Valid Username Wrong Password
    try {
        response = await api.post("/api/user/delete", wrongPasswordRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid delete given an incorrect password";
        }

        reportSuccess("Passed Valid Username Wrong Password Test");
    } catch(error) {
        reportFailure(error);
    }

    // Valid Delete Test and Duplicate Delete Test
    try {
        response = await api.post("/api/user/delete", validDeleteRequest);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid Delete Request was unsuccessful";
        }

        // Should fail since the user is already deleted
        response = await api.post("/api/user/delete", validDeleteRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Successful delete when user was already deleted";
        }

        reportSuccess("Passed Valid Delete Test and Duplicate Delete Test");
    } catch (error) {
        reportFailure(error);
    }
}

/************************** STUDYSET TESTS ***************************/
let studysetTests = async function studysetTests() {

    console.log("\n -------------------- BEGIN STUDYSET TESTS -------------------- \n");

    let registerRequest = {
        username: "person123",
        password: "password",
        email: "randomemail@email.com"
    }
    let validStudySetCreateRequest = {
        username : "person123",
        subject : "biology"
    }
    let anotherValidStudySet = {
        username : "person123",
        subject : "tennis"
    }
    let invalidStudySetCreateRequest = {
        username : "123person",
        subject : "chemistry"
    }
    var response = null;
    var studySetIDOne = null;
    var studySetIDTwo = null;

    // clear the study set database and user database
    clearStudySets()
    clearUsers()

    // register user in system
    response = await api.post("/api/user/register", registerRequest);

    // Create tests
    try {
        response = await api.post("/api/studyset/create", validStudySetCreateRequest);
        studySetIDOne = response.data.studysetID;
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid study set create was unsuccessful"
        }

        response = await api.post("/api/studyset/create", anotherValidStudySet);
        studySetIDTwo = response.data.studysetID;
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "valid study set create was unsuccessful"
        }

        // Invalid study set create request
        response = await api.post("/api/studyset/create", invalidStudySetCreateRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "study set made for user that does not exist"
        }

        reportSuccess("Passed Basic Create tests");
    } catch (error) {
        reportFailure(error);
    }

    // Retrieval tests
    try {
        response = await api.get("/api/studyset/allsets/person123");
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "unable to get study sets for existing user"
        }
        if (response.data.studysets.length != 2) {
            throw "user does not have exactly 2 study sets"
        }

        // Invalid retreival
        response = await api.get("/api/studyset/allsets/123person");
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "successful study set retreival for non-existing user"
        }

        reportSuccess("Passed StudySet Retrieval Tests")
    } catch (error) {
        reportFailure(error);
    }

    let validDeleteRequest = {
        username : "person123",
        studysetID : studySetIDOne
    }
    let invalidDeleteRequest = {
        username : "123person",
        studysetID : studySetIDTwo
    }

    // Delete Tests
    try {
        response = await api.post("/api/studyset/delete", validDeleteRequest);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid delete was unsuccessful for study set"
        }

        response = await api.post("/api/studyset/delete", invalidDeleteRequest)
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Invalid delete was successful for non existing user"
        }

        reportSuccess("Passed Delete Tests for Study Sets")
    } catch (error) {
        reportFailure(error);
    }
}

/************************** FLASHCARD TESTS ***************************/
let flashcardTests = async function flashcardTests() {
    
    console.log("\n -------------------- BEGIN FLASHCARD TESTS -------------------- \n");

    // Needed for setup
    clearUsers()
    clearStudySets()

    let registerRequest = {
        username: "person123",
        password: "password",
        email: "randomemail@email.com"
    }
    let validStudySetCreateRequest = {
        username : "person123",
        subject : "biology"
    }
    var studysetID = null;
    var response = null;

    response = await api.post("/api/user/register", registerRequest);
    response = await api.post("/api/studyset/create", validStudySetCreateRequest);
    studysetID = response.data.studysetID

    let validFlashCardOne = {
        flashcardID: null, 
        studysetID : studysetID,
        questionText : "2 + 2 = ?",
        answerText : "4"
    }
    let validFlashCardTwo = {
        flashcardID: null, 
        studysetID : studysetID,
        questionText : "What is the capital of Arizona?",
        answerText : "Phoenix"
    }

    let validFlashCardOneRequest = {
        studysetID : studysetID,
        questionText : "2 + 2 = ?",
        answerText : "4"
    }
    let validFlashCardTwoRequest = {
        studysetID : studysetID,
        questionText : "What is the capital of Arizona?",
        answerText : "Phoenix"
    }

    let invalidFlashCardRequest = {
        studysetID : null,
        questionText : "2 + 2 = ?",
        answerText : "4"
    }
    // Clear the database
    clearFlashcards();
    
    // // Create flashcard test
    try {
        // Valid Request
        response = await api.post("/api/flashcard/create", validFlashCardOne);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Flashcard 1 not created and should have been"
        } else {
            validFlashCardOne.flashcardID = response.data.flashcardID; 
        }
        // Subsequent valid request
        response = await api.post("/api/flashcard/create", validFlashCardTwo);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Flashcard 2 not created and should have been"
        } else {
            validFlashCardTwo.flashcardID = response.data.flashcardID; 
        }
        // Invalid request
        response = await api.post("/api/flashcard/create", invalidFlashCardRequest);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Invalid Flashcard create request was successful"
        }
       reportSuccess("Passed Basic FlashCard Create Tests");
    } catch (error) {
        reportFailure(error);
    }
    let updateFlashCardTwo = {
        flashcardID: validFlashCardTwo.flashcardID, 
        studysetID : studysetID,
        questionText : "What is the capital of Utah?",
        answerText : "Salt Lake City"
    }
    let deleteFlashCardOne = {
        flashcardID: validFlashCardOne.flashcardID, 
    }
    let deleteFlashCardTwo = {
        flashcardID: validFlashCardTwo.flashcardID, 
    }
    let invalidDelete = {
        flashcardID: "notarealflashcard", 
    }
    let invalidUpdate = {
        flashcardID: "notarealflashcard", 
        studysetID : studysetID,
        questionText : "Do sharks swim?",
        answerText : "Yes"
    }

    // Delete Flashcard test
    try {
        // Valid Delete
        response = await api.post("/api/flashcard/delete", deleteFlashCardOne);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "FlashCard 1 was not deleted and should have been"
        }

        // Invalid Delete
        response = await api.post("/api/flashcard/delete", invalidDelete);
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Invalid Delete request was successful"
        }

        reportSuccess("Passed FlashCard Delete Tests")
    } catch (error) {
        reportFailure(error);
    }

    // Update Flashcard Test
    try {
        // Valid Update
        response = await api.post("/api/flashcard/update", updateFlashCardTwo);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Valid flashcard Update was unsuccessful"
        }
        // Invalid Update
        response = await api.post("/api/flashcard/update", invalidUpdate);
        if (response.data.success) {
            throw "Invalid flashcard Update was successful"
        }

        reportSuccess("Passed flashcard Update Tests")
    } catch (error) {
        reportFailure(error);
    }
    
    response = await api.post("/api/flashcard/create", validFlashCardOne);

    // Test for retreiving all flashcards for a study set
    try {
        // Should get all flashcards with proper order by question number
        response = await api.get("/api/flashcard/allcards/" + validFlashCardOne.studysetID);
        if (!response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Unsuccessful retrieval of flashcards in studyset " + validFlashCardOne.studysetID
        }
        
        // Check the size and order
        if (response.data.flashCards.length != 2) {
            throw "Did not get exactly 2 flashcards from the database"
        }
        // } else {
        //     console.log(response.data.flashCards); 
        // }

        // Invalid retrieval of flashcards for non-existing study set
        response = await api.get("/api/flashcard/allcards/dontexist");
        if (response.data.success) {
            console.log("Error Message: " + response.data.message); 
            throw "Successful response for getting flashcards from non-existing study set"
        }

        reportSuccess("Passed flashcard retrieval tests")
    } catch (error) {
        reportFailure(error); 
    }
}

/***************************** Run Tests ********************************/

// MAKE SURE THAT THE DATABASE URL IS "mongodb://localhost:27017/buddy-study-test"
let tests = async function() {
    // Comment out any tests that you do not need running
    await registerTests();
    await loginTests();
    await userDeleteTests();
    await studysetTests();
    await flashcardTests();
}

// Run test suite
tests()