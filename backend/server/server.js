// Set up main server thread
const {Worker, isMainThread, threadId} = require("worker_threads"); 

// Packages
const envConfig = require("dotenv").config(); 
const express = require("express"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 
const uuid = require("uuid"); 
const Ably = require("ably"); 

// Imported models
const models = require("./models.js"); 
const User = models.userModel; 

// Ably set-up
const ABLY_API_KEY = process.env.ABLY_API_KEY; 
const realtime = Ably.Realtime({
    key: ABLY_API_KEY, 
    echoMessage: false, 
});

// REST API routes
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

/* --- BEGIN Ably Context --- */  

// Channels
const globalChannelChName = "main-game-thread"; 
let globalChannel; 

// Global Variables
let activeLobbies = {};

/* --- END Ably Context --- */ 

// Connect to Ably Realtime
realtime.connection.once("connected", () => {
    globalChannel = realtime.channels.get(globalChannelChName);
    globalChannel.presence.subscribe("enter", (player) => {
        console.log(`New Game Lobby Host: ${player.data.username}`); 
        activeLobbies[player.data.lobbyId] = {
            host: player.data.username
        } 
        createNewLobby(
            player.data.username, 
            player.data.lobbyId, 
            player.clientId
        ); 
    }); 
}); 

// Add ABLY authtoken for given username, used for authUrl authentication in client
app.get("/api/game/auth", async (req, res) => {
    const tokenParams = {clientId: uuid.v4()}; 
    realtime.auth.createTokenRequest(tokenParams, function (err, tokenRequest) {
        if (err) {
            res.status(500).send("Error requesting token: " + JSON.stringify(err)); 
        } else {
            res.setHeader("Content-Type", "application/json"); 
            res.setHeader("Access-Control-Allow-Origin", "*"); 
            res.send(JSON.stringify(tokenRequest)); 
        }
    }); 
}); 

// Create new game lobby (returns lobbyId)
// TODO: Maybe this should be post?? I'm not sure, since it's not REST...
// Maybe it shouldn't 
app.get("/api/game/newlobby", async (req, res) => {
    try {
        let username = req.query.username; 
        if ((username == null) || (username == "")) {
            res.send({
                success: false, 
                message: "Must include username.."
            }); 
            return; 
        }
        const user = await User.findOne({
            username: username
        }); 
        if (!user) {
            res.send({
                success: false, 
                message: "User \"${username}\" does not exist..",  
            }); 
            return; 
        }
        // const lobbyId = uuid.v4(); 
        const lobbyId = createLobbyCode(); 
        res.send({
            lobbyId: lobbyId, 
            success: true
        }); 
    } catch (error) {
        console.log(error); 
        res.sendStatus(500); 
    }
}); 

function createLobbyCode() {
    let result = ''; 
    let chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'; 
    let charsLength = chars.length; 
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * charsLength)); 
    }
    return result; 
}

function createNewLobby(hostUsername, lobbyId, hostClientId) {
    if (isMainThread) {
        const worker = new Worker("./lobby-server.js", {
            workerData: {
                hostUsername: hostUsername, 
                lobbyId: lobbyId, 
                hostClientId: hostClientId
            }
        }); 
        console.log(`\nCREATING NEW THREAD WITH ID ${threadId}`); 
        worker.on("error", (error) => {
            console.log(`WORKER EXITED DUE TO AN ERROR ${error}`); 
            console.log(`# of Active Lobbies: ${Object.keys(activeLobbies).length}`); 
        }); 
        worker.on("message", (msg) => {
            if (msg.lobbyId && !msg.killWorker) {
                activeLobbies[msg.lobbyId] = {
                    totalPlayers: msg.totalPlayers, 
                    gameStarted: msg.gameStarted, 
                }; 
                console.log(`# of Active Lobbies: ${Object.keys(activeLobbies).length}`); 
            } else if (msg.lobbyId && msg.killWorker) {
                delete activeLobbies[msg.lobbyId]; 
                console.log(`# of Active Lobbies: ${Object.keys(activeLobbies).length}`); 
            } else {
                activeLobbies[msg.lobbyId].gameStarted = msg.gameStarted; 
                console.log("Main thread aware of game started.."); 
            }
        }); 
        
        worker.on("exit", (code) => {
            console.log(`WORKER EXITED WITH THREAD ID ${threadId}`); 
            if (code != 0) {
                console.log(`WORKER EXITED DUE TO AN ERROR WITH CODE ${code}\n`); 
            }
        }); 
    }
}

// API Routes
app.use("/api/user", users.routes); 
app.use("/api/flashcard", flashcards.routes); 
app.use("/api/studyset", studysets.routes); 

app.listen(3000, () => console.log("Server listening on port 3000!")); 