/*** Bot's Olympics functionality ***/

import { Interaction } from "discord.js" 

/** Register a new submission */
function registerSubmission(interaction: Interaction) : void {
    /*
        Given a submission from a player in the form of
        /submit <EVENT_NAME> message.content, submit this information
        to a database of Olympics submissions
    */
}

/** Validate the new submission via reaction */
function invalidateSubmission(interaction: Interaction) : boolean {
    /*
        Allows judges to invalidate a specified user's submission 
        for an event via /invalid @user <EVENT_NAME>. Updates the databse
    */
    return false;
}

/** Get the current board of submissions for users */
function getOlympicsBoard() {
    /*
        Gets the current board of Olympics submissions (just a table of
        users to things they submitted)
    */
    return {};
}