# Buddy Study
## State Variables: Frontend 
### Host view 
* lobbyCode: `string`
* players[ clientId: `string` ]: `player`
```
player: {
    username: string,
    isHost: bool,
    isReady: bool,
    // score: int
}
```
* chosenStudySet: `string`
* curStudySetName: `string`
* gameStarted: `bool`

### Player View
* lobbyCode: `string`
* players: `string[]` 
* curStudySetName: `string`
* isReady: `bool`

### Game Countdown View
* countdownTimer: `int`

### Question View
* qNum: `int`
* qTimer: `int`
* qText: `string`
* options: `string[4]`
* playerAnswer: `int`

### Leaderboard View
* leaderboard: `leaderboard`
```
leaderboard: {
    isLastQ: bool, 
    playerScores: [
        {
            username: string,
            score: int
        }
    ]
}
```
* nextQTimer: `int`
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
* playerChannels[ clientId: `string` ]: `ably-channel`
* globalPlayerState[ clientId: `string` ]: `playerState`
```
playerState: {
    id: `string`, 
    username: `string`, 
    isHost: `string`, 
    score: `int`
}
```
* lobbyChannel: `ably-channel`
* lobbyChName: `string`
* hostAdminCh: `ably-channel`
* hostAdminChName: `string`
* gameStarted: `bool`
* totalPlayers: `int`
* questions: `question[]`
```
question: {
    qNum: int, 
    qText: string, 
    options: string[]
    aText: string 
}
```