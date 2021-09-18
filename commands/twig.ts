import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";

const TwigCommand: MitOsuCommand = {
  name: "twig",

  slashCommand: new SlashCommandBuilder()
    .setName("twig")
    .setDescription("Replies with 'chika'")
    .toJSON(),

  handle: (interaction) => interaction.reply("chika"),
};

export default TwigCommand;
