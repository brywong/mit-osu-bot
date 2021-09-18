import mongoose, { Document } from "mongoose";
import { EventType } from "../types";

export interface Submission extends Document {
  userIds: string[];
  complete: boolean;
  eventType: EventType;
  content?: string;
}

const SubmissionSchema = new mongoose.Schema<Submission>({
  userIds: { type: [String], required: true },
  complete: { type: Boolean, required: true },
  eventType: { type: String, required: true },
  content: String,
});

export const SubmissionModel = mongoose.model("Submission", SubmissionSchema);
