import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
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
  checkIsAdmin,
} from "../utils";

const ViewCommand: MitOsuCommand = {
  name: "view",

  slashCommand: new SlashCommandBuilder()
    .setName("view")
    .setDescription("View submissions by a user and/or event type")
    .addStringOption((option) =>
      option.setName("event").setDescription("Event to filter by")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to filter by")
    )
    .toJSON(),

  handle: async (interaction, client) => {
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
      submissions
        .map((s) => s.userIds)
        .reduce((acc, cur) => [...acc, ...cur], [])
    );

    const uidsToUsername: { [key: string]: string } = {};
    for (const uid of uids) {
      uidsToUsername[uid] = (
        await client.users.fetch(uid, { cache: true })
      ).tag;
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
  },
};

export default ViewCommand;
