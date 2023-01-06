import { Client, Intents } from "discord.js";
import { BOT_TOKEN, CLIENT_ID, GUILD_IDS } from "./config.json";
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
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  partials: ["CHANNEL"]
});

const guildIds = GUILD_IDS; // list of guild ids
const clientId = CLIENT_ID; // client id of discord app
const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

const globalCommands = [
  SubmitCommand,
  InvalidCommand,
  DeletemyCommand,
  ViewCommand,
  LeaderboardCommand,
];

const guildCommands = [TwigCommand];

const commandsMap = Object.fromEntries(globalCommands.map((c) => [c.name, c]).concat(guildCommands.map((c) => [c.name, c])));
const guildSlashCommands = guildCommands.map((c) => c.slashCommand);
const globalSlashCommands = globalCommands.map((c) => c.slashCommand);

async function registerGlobalSlashCommands() {
  console.log(`Registering global slash commands`);

  await rest.put(Routes.applicationCommands(clientId), {
    body: globalSlashCommands,
  });
  console.log(`Successfully registered ${globalSlashCommands.length} global command(s)`);
}

async function registerGuildSlashCommands(guildId: string) {
  console.log(`Registering guild slash commands for ${guildId}`);

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: guildSlashCommands,
  });
  console.log(`Successfully registered ${guildSlashCommands.length} guild command(s) for ${guildId}`);
}

registerGlobalSlashCommands();

for (const guildId of guildIds) {
  registerGuildSlashCommands(guildId);
}

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

  console.log(message);

  if (
    message.type === "REPLY" &&
    message.mentions.repliedUser?.id === client.user.id
  ) {
    processSubmissionContent(message);
  } else if (
    message.content.includes("<:eh") &&
    message.author.id !== client.user.id
  ) {
    message.reply("<:eh:1060817088970768395>");
  }
});

client.login(BOT_TOKEN);
