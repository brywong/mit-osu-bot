import { Client, Intents } from "discord.js";
import { BOT_TOKEN } from "./config.json";
import { REST } from "@discordjs/rest";

import { Routes } from "discord-api-types/v9";

import Database from "./db";

import SubmitCommand, { processSubmissionContent } from "./commands/submit";
import TwigCommand from "./commands/twig";
import InvalidCommand from "./commands/invalid";
import DeletemyCommand from "./commands/deletemy";
import ViewCommand from "./commands/view";
import LeaderboardCommand from "./commands/leaderboard";

Database.init();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const guildId = "661656176244686858";
const clientId = "888306044558802965";
const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

const commands = [
  SubmitCommand,
  TwigCommand,
  InvalidCommand,
  DeletemyCommand,
  ViewCommand,
  LeaderboardCommand,
];

const commandsMap = Object.fromEntries(commands.map((c) => [c.name, c]));
const slashCommands = commands.map((c) => c.slashCommand);

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName in commandsMap) {
    await commandsMap[commandName].handle(interaction, client);
  }
});

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
