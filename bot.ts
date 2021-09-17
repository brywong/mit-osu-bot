import { Client, Intents } from "discord.js";
import { BOT_TOKEN } from "./config.json"
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from "@discordjs/builders";

import { Routes } from 'discord-api-types/v9'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const guildId = '661656176244686858';
const clientId = '888306044558802965';
const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

const commands = [
  new SlashCommandBuilder().setName('twig').setDescription("Replies with 'chika'")
].map(cmd => cmd.toJSON())

async function registerSlashCommands() {
  console.log("Registering slash commands");

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log(`Successfully registered ${commands.length} command(s)`);
}

registerSlashCommands();


client.once('ready', () => {
  console.log("Bot started");
})

// new slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "twig") {
    await interaction.reply("chika")
  }
})

// old-style commands
client.on('messageCreate', (message) => {
  if (message.content === "!meme") {
    message.reply("Meme!!");
  }
})

client.login(BOT_TOKEN);