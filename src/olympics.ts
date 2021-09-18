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

async function getSubmissionForEvent(
  userId: string,
  event: EventType
): Promise<Submission | undefined> {
  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    event,
  });
}

async function getSubmissionForReply(
  message: Message
): Promise<Submission | undefined> {
  const messageId = message.reference?.messageId;
  const userId = message.author.id;
  if (!messageId) {
    return;
  }

  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    replyRef: messageId,
  });
}

/** Register a new submission */
export async function registerSubmission(interaction: CommandInteraction) {
  /*
        Given a submission from a player in the form of
        /submit <EVENT_NAME>, request the correct submissions information
        for the event
    */
  const event = interaction.options.getString("name")?.toUpperCase();
  const otherUsers = interaction.options.getString("users");

  const userIds = [interaction.user.id];
  if (otherUsers) {
    const otherUserUids = [...otherUsers.matchAll(/<@!?(\d+)>/g)].map(
      (match) => match[1]
    );
    userIds.push(...otherUserUids);
  }

  if (isValidEventType(event)) {
    const existing = await getSubmissionForEvent(interaction.user.id, event);

    if (existing?.complete) {
      const msg = await interaction.reply({
        content: `**[REPLY TO SUBMIT ${event}]** You've already submitted for ${event}, but you can reply to this to submit another file/link`,
        fetchReply: true,
      });
      existing.replyRef = msg.id;
      await existing.save();
      return;
    }

    const msg = await interaction.reply({
      content: `**[REPLY TO SUBMIT ${event}]** Please send ${EVENT_TYPES_MAP[event]}`,
      fetchReply: true,
    });

    const submission = new SubmissionModel({
      userIds: [interaction.user.id],
      complete: false,
      event: event,
      replyRef: msg.id,
    });
    await submission.save();
  } else {
    interaction.reply("Invalid event submitted D:");
  }
}

export async function processSubmissionContent(message: Message) {
  const user = message.author.id;
  const submission = await getSubmissionForReply(message);
  if (!submission) return;

  let content = message.content;
  const attachment = message.attachments.first();
  if (attachment) {
    content = attachment.url;
  }

  if (!submission.content) {
    submission.content = [content];
  } else {
    submission.content.push(content);
  }

  submission.complete = true;
  await submission.save();
  const reply = await message.reply(
    `Succesfully submitted \`${content}\` for ${submission.event}. To attach more, reply again to the message above.`
  );
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
  const result: Submission[] = await SubmissionModel.find({ complete: true });

  const eventsPerPersons = { foo: 10, bar: 12 };
  const orderedPeople = Object.keys(eventsPerPersons).sort();
  return Formatters.codeBlock(
    orderedPeople
      .map(
        (name, idx) =>
          `${idx + 1} ${name}: ${
            eventsPerPersons[name as keyof typeof eventsPerPersons]
          }`
      )
      .join("\n")
  );
}
