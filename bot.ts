import { Client, Intents } from "discord.js";
import { BOT_TOKEN } from "./config.json"

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log("Bot started");
})

client.login(BOT_TOKEN);