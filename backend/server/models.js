const express = require("express"); 
const mongoose = require("mongoose"); 
const router = express.Router(); 

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

// Schema for studysets
const studySetSchema = new mongoose.Schema({
    studysetID: String, 
    username: String, 
    subject: String,
}); 

const User = mongoose.model("User", userSchema); 
const StudySet = mongoose.model("StudySet", studySetSchema); 
const FlashCard = mongoose.model("FlashCard", flashCardSchema);

module.exports = {
    userModel: User, 
    flashcardModel: FlashCard,  
    studysetModel: StudySet, 
}; 