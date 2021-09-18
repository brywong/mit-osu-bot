/*** Bot's Olympics functionality ***/

import { CommandInteraction } from "discord.js"
import { SubmissionModel } from "../models/submission";
import { EVENT_TYPES_MAP, isValidEventType, EventType } from "../types"

/** Generic Olympics POST */
function POST(uname: String, event: EventType, content: string): boolean {
    return false;
}

/** Register a new submission */
export function registerSubmission(interaction: CommandInteraction): string {
    /*
        Given a submission from a player in the form of
        /submit <EVENT_NAME>, request the correct submissions information
        for the event
    */
    const event = interaction.options.getString("name");
    if (isValidEventType(event)) {
        return "Submit your".concat(' ', EVENT_TYPES_MAP[event]);
    }
    return "Invalid event submitted D:";
}

/** Validate the new submission via reaction */
function invalidateSubmission(interaction: CommandInteraction): boolean {
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