export const EVENT_TYPES_MAP = {
  "F1": "a screenshot",
  "F2": "a screenshot",
  "F3": "a screenshot",
  "F4": "a screenshot",
  "F5": "multiple screenshots, one for each of your scores",
  "F6": "an image containing both your score and your sandwich",
  "F7": "a screenshot",
  "F8": "a screenshot",
  "F9": "a screenshot",
}

export function isValidEventType(event: string | undefined): event is EventType {
  return !!event && event in EVENT_TYPES_MAP;
}

export type EventType = keyof typeof EVENT_TYPES_MAP