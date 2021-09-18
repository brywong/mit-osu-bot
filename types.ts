export const EVENT_TYPES_MAP = {
  F1: "a screenshot",
  F2: "a screenshot",
  F3: "a screenshot",
  F4: "a screenshot",
  F5: "multiple screenshots, one for each of your scores",
  F6: "an image containing both your score and your sandwich",
  F7: "a screenshot",
  F8: "a screenshot",
  F9: "a screenshot",
  B1: "a screenshot",
  B2: "a screenshot",
  B3: "an mp link",
  B4: "a screenshot",
  B5: "a screenshot",
  B6: "a screenshot",
  B7: "a screenshot",
  B8: "a mp link",
  B9: "a video clearly showing that you played the map with your feet",
  B10: "a screenshot",
  B11: "a screenshot",
  B12: "a video clearly showing that you played the map using bread",
  B13: "an mp link",
  B14: "a screenshot",
  B15: "a screenshot",
  C1: "a video creation",
  C2: "a text file attachment",
  C3: "a screenshot or video",
  C4: "an image or video",
  C5: "a multiple screenshots, one for each of your scores",
  C6: "a text file attachment",
  C7: "a text file attachment",
  C8: "a video with audio added to replay",
};

export function isValidEventType(
  event: string | undefined
): event is EventType {
  return !!event && event in EVENT_TYPES_MAP;
}

export type EventType = keyof typeof EVENT_TYPES_MAP;
