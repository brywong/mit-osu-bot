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
) {
  let user = interaction.options.getUser("user");
  const event = interaction.options.getString("event")?.toUpperCase();
  if (!user && !event) {
    user = interaction.user!; // if no params provided, filter to current user
  }

  const filter: any = { complete: true };
  if (user) {
    filter.userIds = { $elemMatch: { $eq: user.id } };
  }
  if (event) {
    if (!isValidEventType(event)) {
      interaction.reply(`${event} is not a valid event`);
      return;
    }

    filter.event = event;
  }

  const submissions: Submission[] = await SubmissionModel.find(filter);
  const uids = new Set(
    submissions.map((s) => s.userIds).reduce((acc, cur) => [...acc, ...cur], [])
  );

  const uidsToUsername: { [key: string]: string } = {};
  for (const uid of uids) {
    uidsToUsername[uid] = (await client.users.fetch(uid, { cache: true })).tag;
  }

  let title: string;
  if (user && event) {
    title = `Submissions for ${user.tag} on Event ${event}`;
  } else if (user) {
    title = `All submissions for ${user.tag}`;
  } else {
    title = `All submissions for ${event}`;
  }

  const submissionFields = submissions.map((submission) => {
    const usernames = submission.userIds.map((uid) => uidsToUsername[uid]);
    return {
      name: `Event ${submission.event} by ${usernames.join(", ")}`,
      value: submission.content!.join("\n"),
    };
  });

  // Potentially split the reponse into multiple messages, to avoid going over the embed size limit
  const PAGE_SIZE = 10;

  const makePayload = (startIndex: number) =>
    new MessagePayload(interaction, {
      embeds: [
        new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(title)
          .addFields(
            submissionFields.slice(startIndex, startIndex + PAGE_SIZE)
          ),
      ],
    });

  interaction.reply(makePayload(0));
  for (let i = PAGE_SIZE; i < submissionFields.length; i += PAGE_SIZE) {
    interaction.followUp(makePayload(i));
  }
}

/** Validate the new submission via reaction */
export async function invalidateSubmission(
  interaction: CommandInteraction
): Promise<string> {
  /*
        Allows judges to invalidate a specified user's submission 
        for an event via /invalid @user <EVENT_NAME>. Updates the databse
    */
  const uid = interaction.options.getUser("user");
  const event = interaction.options.getString("event")?.toUpperCase();

  if (isValidEventType(event)) {
    let existing: any;
    if (uid) {
      existing = await deleteSubmission(uid.id, event);
    } else {
      const callerid = interaction.user;
      existing = await deleteSubmission(callerid.id, event);
    }

    if (existing["deletedCount"] == 1) {
      if (event == "B9") {
        return "Deleted your feet pics :<";
      } else {
        return `Successfully deleted ${event}`;
      }
    }
    return "Failed to delete D:";
  }
  return "Invalid user or event type";
}

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
