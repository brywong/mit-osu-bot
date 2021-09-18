"use strict";
/*** Bot's Olympics functionality ***/
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSubmission = void 0;
const EVENT_ABVS = [
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9",
    "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9",
    "B10", "B11", "B12", "B13", "B14", "B15",
    "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8",
];
const EVENT_TYPES = {
    "F1": "screenshot",
    "F2": "screenshot",
    "F3": "screenshot",
    "F4": "screenshot",
    "F5": "multiple screenshots, one for each of your scores",
    "F6": "image containing both your score and your sandwich",
    "F7": "screenshot",
    "F8": "screenshot",
    "F9": "screenshot",
};
/** Generic Olympics POST */
function POST(uname, event, content) {
    return false;
}
function isValidEventType(event) {
    return event !== null && event in EVENT_TYPES;
}
/** Register a new submission */
function registerSubmission(interaction) {
    /*
        Given a submission from a player in the form of
        /submit <EVENT_NAME>, request the correct submissions information
        for the event
    */
    const event = interaction.options.getString("name");
    if (isValidEventType(event)) {
        return "Submit your".concat(' ', EVENT_TYPES[event]);
    }
    return "Invalid event submitted D:";
}
exports.registerSubmission = registerSubmission;
/** Validate the new submission via reaction */
function invalidateSubmission(interaction) {
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
