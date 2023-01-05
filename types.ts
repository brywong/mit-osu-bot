import { Client, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const EVENT_TYPES_MAP = {
  F1: "multiple screenshots showing the pp values of your plays",
  F2: "a screenshot",
  F3: "a screenshot",
  F4: "an image containing both your score and your boba",
  F5: "a screenshot",
  F6: "a screenshot",
  F7: "multiple screenshots, one for each of your scores",
  F8: "a screenshot",
  F9: "a screenshot",
  F10: "a screenshot",
  F11: "a screenshot",
  B1: "a screenshot",
  B2: "a screenshot",
  B3: "a video clearly showing that you played the map using bread",
  B4: "a video clearly showing that you played the map with your feet",
  B5: "a video clearly showing that you played the map with your hands reversed",
  B6: "a screenshot and an mp link",
  B7: "a screenshot",
  B8: "an mp link",
  B9: "a screenshot and your time zone (in UTC)",
  B10: "a screenshot",
  B11: "a screenshot",
  B12: "a screenshot",
  B13: "a screenshot and a link to your profile",
  B14: "a screenshot",
  B15: "a screenshot",
  B16: "multiple screenshots/images, one for each of your scores",
  C1: "a text entry or a text file attachment",
  C2: "multiple screenshots, one for each of your scores",
  C3: "multiple screenshots of your sliders or a beatmap link",
  C4: "an image",
  C5: "an image or video",
  C6: "a link to an audio file",
  C7: "an image",
};

export function isValidEventType(
  event: string | undefined
): event is EventType {
  return !!event && event in EVENT_TYPES_MAP;
}

export type EventType = keyof typeof EVENT_TYPES_MAP;

export interface MitOsuCommand {
  name: string;

  slashCommand: ReturnType<SlashCommandBuilder["toJSON"]>;

  handle: (interaction: CommandInteraction, client: Client) => Promise<void>;
}
