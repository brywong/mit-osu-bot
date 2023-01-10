import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SubmissionModel } from "../models/submission";
import { EVENT_TYPES_MAP, isValidEventType } from "../types";
import { getSubmissionForEvent, getSubmissionForReply } from "../utils";
import { Message } from "discord.js";

const SubmitCommand: MitOsuCommand = {
  name: "submit",

  slashCommand: new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit an entry for osu! olympics")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("Abbreviated event name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("users")
        .setDescription("(for team events) Other users to submit for")
        .setRequired(false)
    )
    .toJSON(),

  handle: async (interaction) => {
    if (interaction.guildId !== null) {
      await interaction.reply({
        content: `**ERROR:** You cannot submit entries within a Discord server. Please send me a DM and try again.`
      });
      return;
    }

    const event = interaction.options.getString("event")?.toUpperCase();
    const otherUsers = interaction.options.getString("users");

    const userIds = [interaction.user.id];
    if (otherUsers) {
      const otherUserUids = [...otherUsers.matchAll(/<@!?(\d+)>/g)].map(
        (match) => match[1]
      );
      userIds.push(...otherUserUids);
    }

    if (!isValidEventType(event)) {
      interaction.reply("Invalid event submitted D:");
      return;
    }

    const existing = await getSubmissionForEvent(interaction.user.id, event);

    if (existing && existing.complete) {
      // Case 1: User calls /submit after already completing a submission for this event
      const msg = await interaction.reply({
        content: `**[REPLY TO SUBMIT ${event}]** You've already submitted for ${event}. Erasing your old submission, now reply with ${EVENT_TYPES_MAP[event]} to submit a new one.`,
        fetchReply: true,
      });
      existing.replyRef = msg.id;
      existing.content = [];
      existing.userIds = userIds;
      existing.complete = false;
      await existing.save();
      return;
    }

    if (existing && !existing.complete) {
      // Case 2: User calls /submit after starting (but not completing) a submission for this event
      const msg = await interaction.reply({
        content: `**[REPLY TO SUBMIT ${event}]** Reply with ${EVENT_TYPES_MAP[event]} (You previously used /submit ${event} but never replied!)`,
        fetchReply: true,
      });
      existing.userIds = userIds;
      existing.replyRef = msg.id;
      await existing.save();
      return;
    }

    // Case 3: User calls /submit EVENT for the first time
    const msg = await interaction.reply({
      content: `**[REPLY TO SUBMIT ${event}]** Reply with ${EVENT_TYPES_MAP[event]}`,
      fetchReply: true,
    });

    const submission = new SubmissionModel({
      userIds,
      complete: false,
      event: event,
      replyRef: msg.id,
    });

    await submission.save();
  },
};

export async function processSubmissionContent(message: Message) {
  const user = message.author.id;
  const submission = await getSubmissionForReply(message);
  if (!submission) return;

  let content = message.content;
  const attachment = message.attachments.first();
  if (attachment) {
    content = attachment.url;
  }

  // add timestamp to incoming submissions
  let date = new Date();
  date.setTime(message.createdTimestamp);
  content += " @ " + date.toUTCString();

  if (!submission.content) {
    submission.content = [content];
  } else {
    submission.content.push(content);
  }

  submission.complete = true;
  await submission.save();
  await message.reply(
    `Succesfully submitted \`${content}\` for ${submission.event}. To attach more, reply again to the message above.`
  );
}

export default SubmitCommand;
