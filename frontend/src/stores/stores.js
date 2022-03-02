import { writable } from "svelte/store";

export const loggedInUser = writable("default");
export const selectedStudySet = writable("default");