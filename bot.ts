import { Client, Intents } from "discord.js";
import { BOT_TOKEN } from "./config.json"

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.once('ready', () => {
  console.log("Bot started");
})

// new slash commands
client.on('interactionCreate', (interaction) => {
  console.log(interaction);
})

// old-style commands
client.on('messageCreate', (message) => {
  if (message.content === "!meme") {
    message.reply("Meme!!");
  }
})

client.login(BOT_TOKEN);