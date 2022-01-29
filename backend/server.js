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
mongoose.connect('mongodb://localhost:3333/buddy-study', {
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

// Create new user
app.post("/api/user/register", async (req, res) => {
    let existingUsername = await User.findOne({
        username: req.body.username
    }); 
    if (!existingUsername) {
        res.send({
            username: req.body.username, 
            success: false, 
            message: "Username already taken..",
        }); 
    } 
    const user = new User({
        username: req.body.username, 
        password: req.body.password, 
        email: req.body.email,
    }); 
    try {
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

app.listen(3001, () => console.log("Server listening on port 3001!")); 