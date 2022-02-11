const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 

// If we want to include other files: 
// const example = require("./teams.js"); 

const app = express(); 

// Enable CORS on the server
const cors = require("cors");
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
    studysetID: String, 
    questionNum: Number, 
    question: String,
    answer: String,
}); 

// Model for users
const User = mongoose.model("User", userSchema); 

// Delete all users
app.get("/api/database/clearUsers", async (req, res) => {
    User.collection.drop();
    res.send({
        success: true,
        message: "Database Cleared!"
    })
})

// Create new user
app.post("/api/user/register", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.password == null) || (req.body.email == null)) {
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
        if ((req.body.username == null) || (req.body.password == null)) {
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

app.post("/api/user/delete", async (req, res) => {
    try {
        if ((req.body.username == null) || (req.body.password == null)) {
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
        if ((req.body.studysetID == null) || (req.body.questionNum == null) || 
                (req.body.questionText == null) || (req.body.answerText == null)) {
            res.send({
                success: false, 
                message: "Must include study set ID, question number, question text, and answer text.."
            }); 
            return; 
        }
        let studyset = await StudySet.findOne({
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
            studysetID: req.body.studysetID, 
            questionNum: req.body.questionNum, 
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

app.post("api/flashcard/delete", async (req, res) => {
    try {
        if ((req.body.studysetID == null) || (req.body.questionNum == null)) {
            res.send({
                success: false, 
                message: "Must include study set ID and question number.."
            }); 
            return; 
        }
        const flashCard = await FlashCard.findOne({
            studysetID: req.body.studysetID, 
            questionNum: req.body.questionNum, 
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

app.post("/api/flashcard/update", async (req, res) => {
    try {
        if ((req.body.studysetID == null) || (req.body.questionNum == null) || 
                (req.body.questionText == null) || (req.body.answerText == null)) {
            res.send({
                success: false, 
                message: "Must include study set ID, question number, question text, and answer text.."
            }); 
            return; 
        }
        const flashCard = await FlashCard.findOne({
            studysetID: req.body.studysetID, 
            questionNum: req.body.questionNum, 
        });     
        if (!flashCard) {
            res.send({
                success: false, 
                message: "Flash card does not exist.."
            })
            return; 
        }
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


app.listen(3000, () => console.log("Server listening on port 3000!")); 