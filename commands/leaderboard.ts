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

const LeaderboardCommand: MitOsuCommand = {
  /*
        Allows judges to invalidate a specified user's submission 
        for an event via /invalid @user <EVENT_NAME>. Updates the database
  */
  name: "leaderboard",

  slashCommand: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View Olympics leaderboard (only number of submissions)")
    .toJSON(),

  handle: async (interaction, client) => {
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
    const response = Formatters.codeBlock(
      orderedPeople
        .map((name, idx) => `${idx + 1} ${name}: ${eventsPerPersons[name]}`)
        .join("\n")
    );
    await interaction.reply(response);
  },
};

export default LeaderboardCommand;
