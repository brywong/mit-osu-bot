"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
client.once('ready', () => {
    console.log("Bot started");
});
client.on('interactionCreate', (interaction) => {
    console.log(interaction);
});
client.on('messageCreate', (message) => {
    if (message.content === "!meme") {
        message.reply("Meme!!");
    }
});
client.login(config_json_1.BOT_TOKEN);
