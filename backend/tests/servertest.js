// Testing setup
const axios = require("axios");
const api = axios.create({
    baseURL : "http://localhost:3000"
});

/************************** TESTING UTILITY METHODS ***************************/
let reportFailure = function(message) {
    console.error(message);
}
let reportSuccess = function(message) {
    console.log(message);
}
let assertNotNull = function(object) {
    if (object == null) {
        reportFailure("Response Object is Null!");
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
    
    // Test Valid Register API call
    try {
        let response = await api.post("/api/user/register", validRegisterRequest);
    
        assertNotNull(response);
    
        if (!response.body.success) {
            reportFailure("Register service failed when it should not have");
        }
        if (response.body.username !== validRegisterRequest.username) {
            reportFailure("Response username does not match request username");
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
    
        if (response.body.success) {
            reportFailure("Register service succeeded when it should not have");
        }

        // Passed this test!
        reportSuccess("Invalid Register Passed");
    } catch (error) {
        reportFailure(error);
    }
}




/***************************** Run Tests ********************************/
// Comment out any tests that you do not need running
registerTests();