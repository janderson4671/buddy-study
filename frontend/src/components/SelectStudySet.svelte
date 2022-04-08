<script>

    export let data = {
		/* --- Host Base Variables --- */ 
        hostAdminCh: null, 
        lobbyReady: false, 
        chosenStudySet: null, 

        /* --- Normal Player Base Variables --- */ 
        realtime: null, 
        username: "host123", 
        myClientId: null, 
        globalChannelChName: "main-game-thread", 
        globalChannel: null, 
        lobbyId: null, 
        lobbyChannel: null, 
        myPlayerCh: null, 
        players: {}, 
        curStudySetName: null,
        isReady: true,  
        gameStarted: false, 
        gameKilled: false, 

        /* --- Component Flags --- */
        isGuestJoin: true,
        isCountdown: false,
        isLobby: false,
        isLeaderboard: false,
        isQuestion: false,
        isHost: false,
        isSelectStudySet: false
    }

</script>