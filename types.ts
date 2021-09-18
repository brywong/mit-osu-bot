export const EVENT_TYPES_MAP = {
  "F1": "screenshot",
  "F2": "screenshot",
  "F3": "screenshot",
  "F4": "screenshot",
  "F5": "multiple screenshots, one for each of your scores",
  "F6": "image containing both your score and your sandwich",
  "F7": "screenshot",
  "F8": "screenshot",
  "F9": "screenshot",
  "B1": "screenshot",
  "B2": "screenshot",
  "B3": "mp link",
  "B4": "screenshot",
  "B5": "screenshot",
  "B6": "screenshot",
  "B7": "screenshot",
  "B8": "mp link",
  "B9": "Video clearly showing that you played the map with your feet",
  "B10": "screenshot",
  "B11": "screenshot",
  "B12": "Video clearly showing that you played the map using bread",
  "B13": "mp link",
  "B14": "screenshot",
  "B15": "screenshot",
  "C1": "video creation",
  "C2": "text file attachment",
  "C3": "screenshot or video",
  "C4": "image or video",
  "C5": "multiple screenshots, one for each of your scores",
  "C6": "text file attachment",
  "C7": "text file attachment",
  "C8": "video with audio added to replay",
}

export function isValidEventType(event: string | null): event is EventType {
  return event !== null && event in EVENT_TYPES_MAP;
}

export type EventType = keyof typeof EVENT_TYPES_MAP