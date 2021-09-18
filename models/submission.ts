import mongoose, { Document } from "mongoose";
import { EventType } from "../types";

export interface Submission extends Document {
  userIds: string[];
  complete: boolean;
  event: EventType;
  content?: string[];
  replyRef: string;
}

const SubmissionSchema = new mongoose.Schema<Submission>({
  userIds: { type: [String], required: true },
  complete: { type: Boolean, required: true },
  event: { type: String, required: true },
  content: [String],
  replyRef: { type: String, required: true },
});

export const SubmissionModel = mongoose.model("Submission", SubmissionSchema);
