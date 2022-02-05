const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 

// If we want to include other files: 
// const example = require("./teams.js"); 

const app = express(); 

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
        console.log(existingUsername); 
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
})

app.listen(3000, () => console.log("Server listening on port 3000!")); 