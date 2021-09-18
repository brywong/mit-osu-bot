import { Client, Intents, Options } from "discord.js";
import { BOT_TOKEN } from "./config.json";
import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";

import { Routes } from "discord-api-types/v9";

import { getOlympicsBoard, viewSubmissions } from "./commands/olympics";
import Database from "./db";

import SubmitCommand, { processSubmissionContent } from "./commands/submit";
import TwigCommand from "./commands/twig";
import InvalidCommand from "./commands/invalid";
import DeletemyCommand from "./commands/deletemy";

Database.init();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const guildId = "661656176244686858";
const clientId = "888306044558802965";
const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

const commands = [SubmitCommand, TwigCommand, InvalidCommand, DeletemyCommand];
const commandsMap = Object.fromEntries(commands.map((c) => [c.name, c]));

const oldCommands = [
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View Oly leaderboard (only number of submissions)"),
  new SlashCommandBuilder()
    .setName("lb")
    .setDescription("View Oly leaderboard (only number of submissions)"),
  new SlashCommandBuilder()
    .setName("view")
    .setDescription("View submissions by a user and/or event type")
    .addStringOption((option) =>
      option.setName("event").setDescription("Event to filter by")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to filter by")
    ),
].map((cmd) => cmd.toJSON());

const slashCommands = [...commands.map((c) => c.slashCommand), ...oldCommands];

async function registerSlashCommands() {
  console.log("Registering slash commands");

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: slashCommands,
  });
  console.log(`Successfully registered ${slashCommands.length} command(s)`);
}

registerSlashCommands();

client.once("ready", () => {
  console.log("Bot started");
});

// new slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (
    interaction.channelId !== "661656176244686861" &&
    interaction.channelId !== "886422700510281778"
  ) {
    return;
  }

  const { commandName } = interaction;
  if (commandName in commandsMap) {
    await commandsMap[commandName].handle(interaction);
  }

  if (commandName === "leaderboard" || commandName === "lb") {
    const board = await getOlympicsBoard(client);
    await interaction.reply(board);
  } else if (commandName === "view") {
    await viewSubmissions(client, interaction);
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
  } else if (message.content.includes("<:eh")) {
    message.reply("<:eh:883119732105019423>");
  }
});

client.login(BOT_TOKEN);
