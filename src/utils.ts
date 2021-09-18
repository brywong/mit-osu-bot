import { SubmissionModel } from "../models/submission";

export const getLeaderboard = async () => {
    const leaderboard = await SubmissionModel.find({"complete": true})
    return leaderboard
}