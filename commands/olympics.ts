/*** Bot's Olympics functionality ***/

import {
  CommandInteraction,
  Formatters,
  Client,
  Message,
  User,
  MessageEmbed,
  MessagePayload,
} from "discord.js";
import { SubmissionModel, Submission } from "../models/submission";
import { EVENT_TYPES_MAP, isValidEventType, EventType } from "../types";
import {
  getLeaderboard,
  getSubmissionForEvent,
  getSubmissionForReply,
  deleteSubmission,
} from "../utils";

export async function viewSubmissions(
  client: Client,
  interaction: CommandInteraction
) {}

/** Get the current board of submissions for users */
export async function getOlympicsBoard(client: Client): Promise<string> {
  /*
        Gets the current board of Olympics submissions (just a table of
        users to things they submitted)
    */
  const result: Submission[] = await SubmissionModel.find({ complete: true });
  const eventsPerPersons: { [key: string]: number } = {};
  for (let i = 0; i < result.length; i++) {
    const s = result[i];
    const userids = s.userIds;
    for (let j = 0; j < userids.length; j++) {
      const uid = userids[j];
      const user = await client.users.fetch(uid, { cache: true });
      if (user === undefined) {
        throw "User doesn't exist?! Unexpected";
      }
      if (user.tag in eventsPerPersons) {
        eventsPerPersons[user.tag] += 1;
      } else {
        eventsPerPersons[user.tag] = 1;
      }
    }
  }
  const orderedPeople = Object.keys(eventsPerPersons).sort();
  return Formatters.codeBlock(
    orderedPeople
      .map((name, idx) => `${idx + 1} ${name}: ${eventsPerPersons[name]}`)
      .join("\n")
  );
}
