import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log("Bot started")
})

// TODO: get a discord bot token
// client.login(token);