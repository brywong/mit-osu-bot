import mongoose from "mongoose";
import { EventType } from "../types"

export interface Submission {
  userIds: string[];
  complete: boolean;
  eventType: EventType;
  content: string;
}

const SubmissionSchema = new mongoose.Schema<Submission>({
  userIds: { type: [String], required: true },
  complete: { type: Boolean, required: true },
  eventType: { type: String, required: true },
  content: { type: String, required: true },
});

export const SubmissionModel = mongoose.model("Submission", SubmissionSchema);