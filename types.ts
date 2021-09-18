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
}

export function isValidEventType(event: string | null): event is EventType {
  return event !== null && event in EVENT_TYPES_MAP;
}

export type EventType = keyof typeof EVENT_TYPES_MAP