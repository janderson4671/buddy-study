const express = require("express"); 
const mongoose = require("mongoose"); 
const uuid = require("uuid"); 
const router = express.Router(); 

const models = require("./models.js"); 

// Imported models
const User = models.userModel;  
const FlashCard = models.flashcardModel;  
const StudySet = models.studysetModel;  

router.get("/clear", async (req, res) => {
    try {
        StudySet.collection.drop()
        res.send({
            success: true,
            message: "StudySet Database Cleared!"
        }); 
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Create a new study set
router.post("/create", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.subject == null)) {
            res.send({
                success: false, 
                message: "Must include username and subject..",
            });
            return; 
        }
        const existingStudySet = await StudySet.findOne({
            subject: req.body.subject, 
        }); 
        if (existingStudySet) {
            res.send({
                success: false, 
                message: "You already have a study set with that subject name..", 
            }); 
            return; 
        }
        const user = await User.findOne({
            username: req.body.username, 
        }); 
        if (!user) {
            res.send({
                success: false, 
                message: "User does not exist, cannot create studyset..", 
            }); 
            return; 
        }
        const studySet = new StudySet({ 
            studysetID: uuid.v4(), 
            username: req.body.username, 
            subject: req.body.subject, 
        }); 
        await studySet.save(); 
        res.send({
            success: true, 
            studysetID: studySet.studysetID, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

// Delete a study set and all associated flashcards
router.post("/delete", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.studysetID == null)
                || (req.body.username == "") || (req.body.studysetID == "")) {
            res.send({
                success: false, 
                message: "Must include username and studysetID..", 
            }); 
            return; 
        }
        const studySet = await StudySet.findOne({
            username: req.body.username, 
            studysetID: req.body.studysetID, 
        }); 
        if (!studySet) {
            res.send({
                success: false, 
                message: "Study set does not exist.."
            }); 
            return; 
        }
        const deleteCardsResult = await StudySet.deleteMany({
            studysetID: studySet.studysetID, 
        });
        await studySet.delete(); 
        res.send({
            success: true, 
            message: `${deleteCardsResult.deletedCount} flash cards deleted. ${studySet.subject} study set deleted.`, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

// Retrieve all studysets associated with a user
router.get("/allsets/:username", async (req, res) => {
    try {
        // TODO: check if we need to be testing for a null username here. ?? 
        const user = await User.findOne({
            username: req.params.username, 
        }); 
        if (!user) {
            res.send({
                success: false, 
                message: "User does not exist..", 
            }); 
            return; 
        }
        const studySets = await StudySet.find({
            username: req.params.username, 
        }); 
        if (!studySets.length) {
            res.send({
                success: true, 
                message: "No study sets found.."
            }); 
            return; 
        }
        res.send({
            success: true, 
            studysets: studySets, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

module.exports = {
    routes: router, 
}; 