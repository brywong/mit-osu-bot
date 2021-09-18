import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

// TODO: consider extracting invalidateSubmission to some shared file rather than importing across commands
import { invalidateSubmission } from "./invalid";

const DeletemyCommand: MitOsuCommand = {
  name: "deletemy",

  slashCommand: new SlashCommandBuilder()
    .setName("deletemy")
    .setDescription("Invalidates one of your own entries")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("Abbreviated event name")
        .setRequired(true)
    )
    .toJSON(),

  handle: async (interaction) => {
    const message = await invalidateSubmission(interaction);
    await interaction.reply(message);
  },
};

export default DeletemyCommand;
