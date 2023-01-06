import {
  CommandInteraction,
  Formatters,
  Client,
  Message,
  User,
  MessageEmbed,
  MessagePayload,
} from "discord.js";
import { SubmissionModel, Submission } from "./models/submission";
import { EVENT_TYPES_MAP, isValidEventType, EventType } from "./types";

export const getLeaderboard = async () => {
  const leaderboard = await SubmissionModel.find({ complete: true });
  return leaderboard;
};

export async function getIncompleteSubmission(
  userId: string
): Promise<Submission | undefined> {
  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    complete: false,
  });
}

export async function deleteSubmission(userId: string, event: EventType) {
  return await SubmissionModel.deleteOne({
    userIds: { $elemMatch: { $eq: userId } },
    event: event,
    complete: true,
  });
}

export async function getSubmissionForEvent(
  userId: string,
  event: EventType
): Promise<Submission | undefined> {
  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    event,
  });
}

export async function getSubmissionForReply(
  message: Message
): Promise<Submission | undefined> {
  const messageId = message.reference?.messageId;
  const userId = message.author.id;
  if (!messageId) {
    return;
  }

  return await SubmissionModel.findOne({
    userIds: { $elemMatch: { $eq: userId } },
    replyRef: messageId,
  });
}

const ADMIN_UIDS = ["401460835232382986", "151462465404796929", "274628285638508555"];

/** Checks if a user is admin */
export function checkIsAdmin(uid: string): boolean {
  return ADMIN_UIDS.includes(uid);
}

export async function getUsers(
  client: Client,
  uids: string[]
): Promise<{ [key: string]: User }> {
  const users = (
    await Promise.all(
      uids.map((uid) => client.users.fetch(uid, { cache: true }))
    )
  ).filter((user) => !!user);

  return Object.fromEntries(users.map((user) => [user.id, user]));
}

export function getUsersForSubmissions(
  client: Client,
  submissions: Submission[]
): Promise<{ [key: string]: User }> {
  const uids = new Set(submissions.map((s) => s.userIds).flat());
  return getUsers(client, [...uids]);
}
