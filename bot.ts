import { Client, Intents, Options } from "discord.js";
import { BOT_TOKEN } from "./config.json";
import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";

import { Routes } from "discord-api-types/v9";

import { checkIsAdmin } from "./src/regular";
import {
  registerSubmission,
  processSubmissionContent,
  getOlympicsBoard,
} from "./src/olympics";
import Database from "./db";

Database.init();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const guildId = "661656176244686858";
const clientId = "888306044558802965";
const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

const commands = [
  new SlashCommandBuilder()
    .setName("twig")
    .setDescription("Replies with 'chika'"),
  new SlashCommandBuilder()
    .setName("submit")
    .setDescription("Submit an entry for osu! olympics")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Abbreviated event name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("users")
        .setDescription("Other users to submit for (for team events)")
    ),
  new SlashCommandBuilder()
    .setName("invalid")
    .setDescription("Invalidates an entry. Can only be used by Olympics admin")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Abbreviated event name")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("player")
        .setDescription("Player whose event we are invalidating")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View Oly leaderboard (only number of submissions)"),
  new SlashCommandBuilder()
    .setName("lb")
    .setDescription("View Oly leaderboard (only number of submissions)"),
].map((cmd) => cmd.toJSON());

async function registerSlashCommands() {
  console.log("Registering slash commands");

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  });
  console.log(`Successfully registered ${commands.length} command(s)`);
}

registerSlashCommands();

client.once("ready", () => {
  console.log("Bot started");
});

// new slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "twig") {
    await interaction.reply("chika");
  } else if (commandName == "submit") {
    await registerSubmission(interaction);
  } else if (commandName == "invalid") {
    if (checkIsAdmin(interaction.user.id)) {
      await interaction.reply("Not Implemented Error!!");
    } else {
      await interaction.reply("Non-admins can't invalidate entries D:");
    }
  } else if (commandName == "leaderboard" || commandName == "lb") {
    const board = await getOlympicsBoard(client)
    await interaction.reply(board);
  }
});

// old-style commands
client.on("messageCreate", async (message) => {
  if (!client.user) return;

  if (
    message.type === "REPLY" &&
    message.mentions.repliedUser?.id === client.user.id
  ) {
    processSubmissionContent(message);
  }
});

client.login(BOT_TOKEN);
