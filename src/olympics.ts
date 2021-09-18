/*** Bot's Olympics functionality ***/

import { CommandInteraction, Formatters, Message } from "discord.js";
import { SubmissionModel, Submission } from "../models/submission";
import { EVENT_TYPES_MAP, isValidEventType, EventType } from "../types";
import { getLeaderboard } from "./utils";

async function getIncompleteSubmission(
  userId: string
): Promise<Submission | undefined> {
  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    complete: false,
  });
}

/** Register a new submission */
export async function registerSubmission(
  interaction: CommandInteraction
): Promise<string> {
  /*
        Given a submission from a player in the form of
        /submit <EVENT_NAME>, request the correct submissions information
        for the event
    */
  const incomplete = await getIncompleteSubmission(interaction.user.id);
  if (incomplete) {
    const event = incomplete.eventType;
    return `Complete your submission for ${event} first (submit ${EVENT_TYPES_MAP[event]})`;
  }

  const event = interaction.options.getString("name")?.toUpperCase();
  if (isValidEventType(event)) {
    const submission = new SubmissionModel({
      userIds: [interaction.user.id],
      complete: false,
      eventType: event,
    });
    await submission.save();
    return `Please submit ${EVENT_TYPES_MAP[event]}`;
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
export async function getOlympicsBoard(): Promise<string> {
    /*
        Gets the current board of Olympics submissions (just a table of
        users to things they submitted)
    */
    const result: Submission[] = await SubmissionModel.find({"complete": true})
    
    
    const eventsPerPersons = {"foo": 10, "bar": 12}
    const orderedPeople = Object.keys(eventsPerPersons).sort()
    return Formatters.codeBlock(
            orderedPeople.map((name, idx) => `${idx+1} ${name}: ${eventsPerPersons[name as keyof typeof eventsPerPersons]}`)
            .join('\n'),
    );
}
