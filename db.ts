import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export default {
  init: async () => {
    try {
      if (process.env.MONGO_SRV) {
        await mongoose.connect(process.env.MONGO_SRV);
        console.log("Connected to MongoDB");
      } else {
        throw new Error("MONGO_SRV environment variable not set.")
      }
    } catch (e) {
      console.log("Error connecting to MongoDB", e);
    }
  },
  getConnection: () => mongoose.connection,
};
