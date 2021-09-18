import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Formatters } from "discord.js";
import { SubmissionModel, Submission } from "../models/submission";
import { getUsersForSubmissions } from "../utils";

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
    const usersById = await getUsersForSubmissions(client, result);

    for (const submission of result) {
      for (const uid of submission.userIds) {
        const user = usersById[uid];
        if (!user) {
          await interaction.reply("Unexpected error: can't find user");
          return;
        }
        if (user.tag in eventsPerPersons) {
          eventsPerPersons[user.tag] += 1;
        } else {
          eventsPerPersons[user.tag] = 1;
        }
      }
    }
    const orderedPeople = Object.keys(eventsPerPersons).sort(
      (e1, e2) => eventsPerPersons[e2] - eventsPerPersons[e1]
    );
    const response = Formatters.codeBlock(
      orderedPeople
        .map((name, idx) => `${idx + 1} ${name}: ${eventsPerPersons[name]}`)
        .join("\n")
    );
    await interaction.reply(response);
  },
};

export default LeaderboardCommand;
