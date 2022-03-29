# Buddy Study
## State Variables: Frontend 
### Host (only) View 
* chosenStudySet: `string`
* gameStarted: `bool`

### Player View (including host)
* lobbyId: `string`
* myClientId: `string`
* players[ clientId: `string` ]: `player`
* curStudySetName: `string`
* isReady: `bool`
```
player: {
    username: string,
    isHost: bool,
    isReady: bool,
    // score: int
}
```
### Game Countdown View
* countdownTimer: `int`

### Question View
* qNum: `int`
* qTimer: `int`
* qText: `string`
* options: `string[4]`
* playerAnswer: `string`
* correctAnswer: `string`
* leaderboardTimer: `int`

### Leaderboard View
* isLastQuestion: bool
* leaderboard: `leaderboard`
```
leaderboard: {
    
    playerScores: [
        {
            username: string,
            score: int
        }
    ]
}
```
* nextQuestionTimer: `int`
* playAgainSelected: `bool`
* quitSelected: `bool`

## State Variables: Backend
### server.js
* globalChannel: `ably-channel`
* globalChName: `string`
* totalPlayersOnServer: `int` 
* activeLobbies[ lobbyId: `string` ]: `lobby`
```
lobby: {
    totalPlayers: int, 
    gameStarted: bool
}
```
### lobby-server.js
* lobbyId: `string`
* hostUsername: `string`
* hostClientId: `string`
* MIN_PLAYERS_TO_START_GAME: `int`
* GAME_ROOM_CAPACITY: `int`
* START_TIMER_SEC: `int`
* Q_TIMER_SEC: `int`
* LEADERBOARD_TIMER_SEC: `int`
* NEXT_QUESTION_TIMER_SEC: `int`
* SMALLEST_SET_ALLOWED = `int`
* NUM_FAKE_ANSWERS = `int`
* playerChannels[ clientId: `string` ]: `ably-channel`
* globalPlayerState[ clientId: `string` ]: `playerState`
```
playerState: {
    username: `string`, 
    isHost: `string`, 
    isReady, `string`, 
    score: `int`
}
```
* lobbyChannel: `ably-channel`
* lobbyChName: `string`
* hostAdminCh: `ably-channel`
* hostAdminChName: `string`
* gameStarted: `bool`
* curStudysetID: `string`
* totalPlayers: `int`
* readyCount: `int`
* questionClosed: `bool`
* curQuestionNum: `int`
* playerAnswers: [ clientId: `string` ]: `bool`
* leaderboard: playerInfo[]
```
playerInfo: {
    username: string, 
    score: int
}
```
* questions: `question[]`
```
question: {
    qNum: int, 
    qText: string, 
    options: string[]
    aText: string 
}
```