import mongoose from "mongoose";
import { EventType } from "../types"

export interface Submission {
  userId: string;
  teamUserIds?: string[];
  eventType: EventType;
  content: string;
}

const SubmissionSchema = new mongoose.Schema<Submission>({
  userId: { type: String, required: true },
  teamUserIds: [String],
  eventType: { type: String, required: true },
  content: { type: String, required: true },
});

export const SubmissionModel = mongoose.model("Submission", SubmissionSchema);