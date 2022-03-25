const express = require("express"); 
const uuid = require("uuid"); 
const router = express.Router(); 

const models = require("./models.js"); 

// Imported models
const FlashCard = models.flashcardModel;  
const StudySet = models.studysetModel;  

router.get("/clear", async (req, res) => {
    try {
        FlashCard.collection.drop()
        res.send({
            success : true,
            message: "FlashCard Database Cleared!"
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// Create a new flashcard for a study set 
router.post("/create", async (req, res) => {
    try {
        if ((req.body.studysetID == null) || (req.body.questionText == null) || (req.body.answerText == null)
                || (req.body.studySet == "") || (req.body.questionText == "") || (req.body.answerText == "")) {
            res.send({
                success: false, 
                message: "Must include study set ID, question text, and answer text.."
            }); 
            return; 
        }
        const studyset = await StudySet.findOne({
            studysetID: req.body.studysetID, 
        }); 
        if (!studyset) {
            res.send({
                success: false, 
                message: "Study set doesn't exist..",
            }); 
            return;
        } 
        const flashCard = new FlashCard({
            flashcardID: uuid.v4(), 
            studysetID: req.body.studysetID, 
            questionText: req.body.questionText,
            answerText: req.body.answerText,
        }); 
        await flashCard.save();
        res.send({
            success: true,
            flashcardID: flashCard.flashcardID, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }   
}); 

// Delete a flashcard
router.post("/delete", async (req, res) => {
    try {
        if ((req.body.flashcardID == null) || (req.body.flashcardID == "")) {
            res.send({
                success: false, 
                message: "Must include flashcard ID.."
            }); 
            return; 
        }
        const flashCard = await FlashCard.findOne({
            flashcardID: req.body.flashcardID, 
        });     
        if (!flashCard) {
            res.send({
                success: false, 
                message: "Flash card does not exist.."
            })
            return; 
        }
        await flashCard.delete();
        res.send({
            success: true
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

// Change a flashcard's data
router.post("/update", async (req, res) => {
    try {
        if ((req.body.flashcardID == null) || (req.body.studysetID == null) 
                || (req.body.questionText == null) || (req.body.answerText == null)
                || (req.body.flashcardID == "") || (req.body.studysetID == "") 
                || (req.body.questionText == "") || (req.body.answerText == "")) {
            res.send({
                success: false, 
                message: "Must include flashcard ID, study set ID, question text, and answer text.."
            }); 
            return; 
        }
        const flashCard = await FlashCard.findOne({
            flashcardID: req.body.flashcardID, 
        });     
        if (!flashCard) {
            res.send({
                success: false, 
                message: "Flash card does not exist.."
            })
            return; 
        }
        flashCard.studysetID = req.body.studysetID; 
        flashCard.questionText = req.body.questionText; 
        flashCard.answerText = req.body.answerText;
        await flashCard.save(); 
        res.send({
            success: true, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

// Get flashcards for a given study set
router.get("/allcards/:studysetID", async (req, res) => {
    try {
        const studySet = await StudySet.findOne({
            studysetID: req.params.studysetID, 
        }); 
        if (!studySet) {
            res.send({
                success: false, 
                message: "Study set not found..", 
            }); 
            return; 
        }
        const flashCards = await FlashCard.find({
            studysetID: studySet.studysetID, 
        }); 
        if (!flashCards.length) {
            res.send({
                success: true, 
                message: "No flash cards found.."
            }); 
            return; 
        }
        res.send({
            success: true, 
            flashCards: flashCards, 
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

module.exports = {
    routes: router, 
}; 