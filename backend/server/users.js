const express = require("express"); 
const router = express.Router();

const models = require("./models.js"); 

// Imported models
const User = models.userModel;  
const FlashCard = models.flashcardModel;  
const StudySet = models.studysetModel;  

// Delete all users
router.get("/clear", async (req, res) => {
    try {
        await User.collection.drop();
        res.send({
            success: true,
            message: "User Database Cleared!"
        });
    } catch (error) {
        if (error.code === 26) {
            res.send({
                success: true, 
                message: "User Database was already empty"
            }); 
        } else {
            console.log(error);     
            res.sendStatus(500); 
        }
    }
}); 

// Create new user
router.post("/register", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.password == null) || (req.body.email == null)
                || (req.body.username == "") || (req.body.password == "") || (req.body.email == "")) {
            res.send({
                username: req.body.username, 
                success: false, 
                message: "Must include username, password, and email.."
            })
            return;
        }
        let existingUsername = await User.findOne({
            username: req.body.username
        }); 
        if (existingUsername) {
            res.send({
                username: req.body.username, 
                success: false, 
                message: "Username already taken..",
            }); 
            return;
        } 
        const user = new User({
            username: req.body.username, 
            password: req.body.password, 
            email: req.body.email,
        }); 
        await user.save();
        res.send({
            username: user.username,  
            success: true,
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

// Log in an existing user
router.post("/login", async (req, res) => {   
    try {
        if ((req.body.username == null) || (req.body.password == null)
                || (req.body.username == "") || (req.body.password == "")) {
            res.send({
                username: req.body.username, 
                success: false, 
                message: "Must include both username and password.."
            }); 
            return; 
        }
        const user = await User.findOne({
            username: req.body.username, 
            password: req.body.password
        }); 
        if (user) {
            res.send({
                username: user.username,
                success: true,
            });
        }
        else {
            res.send({
                username: req.body.username,
                success: false, 
                message: "Either username or password is incorrect.."
            }); 
        }
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
});

// Delete a user
router.post("/delete", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.password == null)
                || (req.body.username == "") || (req.body.password == "")) {
            res.send({
                success: false, 
                message: "Must include both username and password.."
            }); 
            return; 
        }
        const user = await User.findOne({
            username: req.body.username, 
            password: req.body.password
        });    
        if (!user) {
            res.send({
                success: false, 
                message: "User does not exist.."
            })
            return; 
        }
        const setCursor = await StudySet.find({
            username: req.body.username, 
        }); 
        for await (const studySet of setCursor) {
            const deleteCardsResult = await FlashCard.deleteMany({
                studysetID: studySet.studysetID, 
            }); 
        }  
        const deleteSetResult = await StudySet.deleteMany({
            username: req.body.username, 
        }); 
        await user.delete();
        res.send({
            success: true
        });     
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

module.exports = {
    routes: router, 
}; 