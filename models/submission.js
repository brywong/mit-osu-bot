"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubmissionSchema = new mongoose_1.default.Schema({
    user: Number,
    requestDate: Date,
    mapId: Number,
    mapsetId: Number,
    title: String,
    artist: String,
    creator: String,
    feedback: String,
    bpm: Number,
    length: String,
    comment: String,
    m4m: Boolean,
    diffs: [{ name: String, mode: String, sr: Number }],
    status: String,
    image: String,
    archived: Boolean,
    target: String,
});
exports.default = mongoose_1.default.model("Submission", SubmissionSchema);
