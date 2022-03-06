// Packages
const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 

// Other server routes
const users = require("./users.js"); 
const flashcards = require("./flashcards.js"); 
const studysets = require("./studysets.js"); 

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

app.use("/api/user", users.routes); 
app.use("/api/flashcard", flashcards.routes); 
app.use("/api/studyset", studysets.routes); 

app.listen(3000, () => console.log("Server listening on port 3000!")); 
