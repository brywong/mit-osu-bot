import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { isValidEventType } from "../types";
import { deleteSubmission, checkIsAdmin } from "../utils";

const InvalidCommand: MitOsuCommand = {
  /*
        Allows judges to invalidate a specified user's submission 
        for an event via /invalid @user <EVENT_NAME>. Updates the database
  */
  name: "invalid",

  slashCommand: new SlashCommandBuilder()
    .setName("invalid")
    .setDescription("Invalidates an entry. Can only be used by Olympics admin")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("Abbreviated event name")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User whose event we are invalidating")
        .setRequired(true)
    )
    .toJSON(),

  handle: async (interaction) => {
    if (checkIsAdmin(interaction.user.id)) {
      const message = await invalidateSubmission(interaction);
      await interaction.reply(message);
    } else {
      await interaction.reply("Non-admins can't invalidate entries D:");
    }
  },
};

/** Validate the new submission via reaction */
export async function invalidateSubmission(
  interaction: CommandInteraction
): Promise<string> {
  const user = interaction.options.getUser("user");
  const event = interaction.options.getString("event")?.toUpperCase();

  if (isValidEventType(event)) {
    let existing: any;
    if (user) {
      existing = await deleteSubmission(user.id, event);
    } else {
      existing = await deleteSubmission(interaction.user.id, event);
    }

    if (existing["deletedCount"] === 1) {
      if (event === "B9") {
        return "Deleted your feet pics :<";
      } else {
        return `Successfully deleted ${event}`;
      }
    }
    return `No submission for ${event} found`;
  }
  return "Invalid user or event type";
}

export default InvalidCommand;
