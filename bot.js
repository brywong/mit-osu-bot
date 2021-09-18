"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const rest_1 = require("@discordjs/rest");
const builders_1 = require("@discordjs/builders");
const v9_1 = require("discord-api-types/v9");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
const guildId = '661656176244686858';
const clientId = '888306044558802965';
const rest = new rest_1.REST({ version: '9' }).setToken(config_json_1.BOT_TOKEN);
const commands = [
    new builders_1.SlashCommandBuilder().setName('twig').setDescription("Replies with 'chika'"),
    new builders_1.SlashCommandBuilder().setName('submit').setDescription("Submit an entry for osu! olympics. Format /submit <EVENT_ABV>"),
    new builders_1.SlashCommandBuilder().setName('invalid').setDescription("Invalidates an entry. Can only be used by Olympics admin"),
    new builders_1.SlashCommandBuilder().setName('leaderboard').setDescription("View Oly leaderboard"),
    new builders_1.SlashCommandBuilder().setName('lb').setDescription("View Oly leaderboard")
].map(cmd => cmd.toJSON());
function registerSlashCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Registering slash commands");
        yield rest.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Successfully registered ${commands.length} command(s)`);
    });
}
registerSlashCommands();
client.once('ready', () => {
    console.log("Bot started");
});
// new slash commands
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (commandName === "twig") {
        yield interaction.reply("chika".concat(' ', interaction.user.id));
    }
    else if (commandName == "submit") {
        yield interaction.reply("Not Implemented Error!!");
    }
    else if (commandName == "invalid") {
        yield interaction.reply("Not Implemented Error!!");
    }
    else if (commandName == "leaderboard" || commandName == "lb") {
        yield interaction.reply("Not Implemented Error!!");
    }
}));
// old-style commands
client.on('messageCreate', (message) => {
    if (client.user && message.mentions.has(client.user.id)) {
        message.reply("<:eh:883119732105019423>");
    }
});
client.login(config_json_1.BOT_TOKEN);
