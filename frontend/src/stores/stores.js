import { writable } from "svelte/store";

export const loggedInUser = writable("default");
export const selectedStudySet = writable(null);
export const IS_DEPLOYED = writable(false);

/* --- Host Base Variables --- */ 
export const hostAdminCh = null; 
export const lobbyReady = false; 
export const chosenStudySet = null; 

/* --- Normal Player Base Variables --- */ 
export const realtime = null; 
export const username = "host123"; 
export const myClientId = null; 
export const globalChannelChName = "main-game-thread"; 
export const globalChannel = null; 
export const lobbyId = null; 
export const lobbyChannel = null; 
export const myPlayerCh = null; 
export const players = {}; 
export const curStudySetName = null;
export const isReady = true;  
export const gameStarted = false; 
export const gameKilled = false; 