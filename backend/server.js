const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 
const uuid = require("uuid"); 

// If we want to include other files: s
// const example = require("./teams.js"); 

const app = express(); 

// Enable CORS on the server
const cors = require("cors");
const { response } = require("express");
app.use(cors({
    origin: "*"
}));

// Make sure to interpret request values as strings
app.use(bodyParser.urlencoded({
    extended: false
})); 

// Parse with json
app.use(bodyParser.json()); 

// Connect to the database
mongoose.connect('mongodb://localhost:27017/buddy-study', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}); 

// Schema for users
const userSchema = new mongoose.Schema({
    username: String, 
    password: String, 
    email: String,
}); 

// Schema for flashcards
const flashCardSchema = new mongoose.Schema({
    flashcardID: String, 
    studysetID: String, 
    question: String,
    answer: String,
}); 

const studySetSchema = new mongoose.Schema({
    studysetID: String, 
    username: String, 
    subject: String,
}); 

// Models
const User = mongoose.model("User", userSchema); 
const FlashCard = mongoose.model("FlashCard", flashCardSchema); 
const StudySet = mongoose.model("StudySet", studySetSchema); 

// Delete all users
app.get("/api/database/clearUsers", async (req, res) => {
    try {
        User.collection.drop();
        res.send({
            success: true,
            message: "User Database Cleared!"
        });
    } catch (error) {
        console.log(error);     
        res.sendStatus(500); 
    }
})

app.get("/api/database/clearStudySets", async (req, res) => {
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

app.get("/api/database/clearFlashcards", async (req, res) => {
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

// Create new user
app.post("/api/user/register", async (req, res) => {
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
app.post("/api/user/login", async (req, res) => {   
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
app.post("/api/user/delete", async (req, res) => {
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

// Create a new flashcard for a study set 
app.post("/api/flashcard/create", async (req, res) => {
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
            question: req.body.questionText,
            answer: req.body.answerText,
        }); 
        await flashCard.save();
        res.send({
            success: true,
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }   
}); 

// Delete a flashcard
app.post("/api/flashcard/delete", async (req, res) => {
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
app.post("/api/flashcard/update", async (req, res) => {
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
app.get("/api/flashcard/allcards/:studysetID", async (req, res) => {
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

// Create a new study set
app.post("/api/studyset/create", async (req, res) => {
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
app.post("/api/studyset/delete", async (req, res) => {
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
app.get("/api/studyset/allsets/:username", async (req, res) => {
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

app.listen(3000, () => console.log("Server listening on port 3000!")); 