import { MitOsuCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { IntegrationApplication, MessageEmbed, MessagePayload } from "discord.js";
import { SubmissionModel, Submission } from "../models/submission";
import { isValidEventType } from "../types";
import { checkIsAdmin, getUsersForSubmissions } from "../utils";

const ViewCommand: MitOsuCommand = {
  name: "view",

  slashCommand: new SlashCommandBuilder()
    .setName("view")
    .setDescription("View submissions by a user and/or event type")
    .addStringOption((option) =>
      option.setName("event").setDescription("Event to filter by")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("User to filter by")
    )
    .addBooleanOption((option) => 
      option.setName("reveal").setDescription("Reveal links to submissions (ADMIN ONLY)")
    )
    .toJSON(),

  handle: async (interaction, client) => {
    let user = interaction.options.getUser("user");
    let reveal = interaction.options.getBoolean("reveal");
    const event = interaction.options.getString("event")?.toUpperCase();

    let isAdmin = checkIsAdmin(interaction.user.id);

    // Only prevent reveals while event is running
    // if (reveal) {
    //   if (!isAdmin) {
    //     interaction.reply("**ERROR**: Only admins can reveal submissions.")
    //     return;
    //   }
    //   if (interaction.guildId !== null) {
    //     interaction.reply("**ERROR**: Submissions can only be revealed within DMs.")
    //     return;
    //   }
    // }

    if (!user && !event) {
      user = interaction.user!; // if no params provided, filter to current user
    }

    const filter: any = { complete: true };
    if (user) {
      filter.userIds = { $elemMatch: { $eq: user.id } };
    }
    if (event) {
      if (!isValidEventType(event)) {
        interaction.reply(`${event} is not a valid event`);
        return;
      }

      filter.event = event;
    }

    const submissions: Submission[] = await SubmissionModel.find(filter);
    const usersById = await getUsersForSubmissions(client, submissions);

    let title: string;
    if (user && event) {
      title = `Submissions for ${user.tag} on Event ${event}`;
    } else if (user) {
      title = `All submissions for ${user.tag}`;
    } else {
      title = `All submissions for ${event}`;
    }

    function compareSubs(a: Submission, b: Submission) {
      // compare event letter
      let letterCompare = a.event.charAt(0).localeCompare(b.event.charAt(0));
      if (letterCompare != 0) {
        return letterCompare;
      }

      // compare event number (if event letters are the same)
      return parseInt(a.event.slice(1)) < parseInt(b.event.slice(1)) ? -1 : 1;
    }

    const submissionFields = submissions.sort((a, b) => compareSubs(a, b)).map((submission) => {
      const usernames = submission.userIds.map((uid) => usersById[uid].tag);
      // reveal flag enabled or current user requesting within DMs
      if ((user === interaction.user && interaction.guildId === null) || reveal) {
        return {
          name: `Event ${submission.event} by ${usernames.join(", ")}`,
          value: submission.content!.join("\n"),
        };
      } else {
        return {
          name: `Event ${submission.event} by ${usernames.join(", ")}`,
          value: "Submitted\n",
        };
      }
      
    });

    // Potentially split the reponse into multiple messages, to avoid going over the embed size limit

    // Returns index to slice at such that the combined message length is below 1000 characters
    function getMaxMessages(submissions: { name: string; value: string; }[]) {
      let limit = 1000;
      let index = 0;
      while (limit > 0 && index < submissions.length) {
        let entry = submissions[index];
        limit -= (entry.name.length + entry.value.length);

        if (limit >= 0) {
          index += 1
        }
      }

      return index;
    }

    const makePayload = (startIndex: number, endIndex: number) => {
      // entry is longer than 1000 characters and needs to be split up into multiple messages
      if (startIndex == endIndex) {
        let newEntry = submissionFields[startIndex];
        let newValue = newEntry.value.slice(0, 1000);
        submissionFields[startIndex].value = newEntry.value.slice(1000);
        return new MessagePayload(interaction, {
          embeds: [
            new MessageEmbed()
              .setColor("#0099ff")
              .setTitle(title)
              .addFields(
                {
                  name: newEntry.name,
                  value: newValue
                }
              ),
          ],
        })
      }
      return new MessagePayload(interaction, {
        embeds: [
          new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(title)
            .addFields(
              submissionFields.slice(startIndex, startIndex + endIndex)
            ),
        ],
      })};

    let start = 0;
    let end = getMaxMessages(submissionFields.slice(start));
    interaction.reply(makePayload(start, end));
    while (end < submissionFields.length) {
      start = end;
      end += getMaxMessages(submissionFields.slice(start));
      interaction.followUp(makePayload(start, end));
    }

    // const PAGE_SIZE = 10;

    // const makePayload = (startIndex: number) =>
    //   new MessagePayload(interaction, {
    //     embeds: [
    //       new MessageEmbed()
    //         .setColor("#0099ff")
    //         .setTitle(title)
    //         .addFields(
    //           submissionFields.slice(startIndex, startIndex + PAGE_SIZE)
    //         ),
    //     ],
    //   });

    // interaction.reply(makePayload(0));
    // for (let i = PAGE_SIZE; i < submissionFields.length; i += PAGE_SIZE) {
    //   interaction.followUp(makePayload(i));
    // }
  },
};

export default ViewCommand;
