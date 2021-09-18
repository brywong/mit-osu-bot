import mongoose from "mongoose";
import { MONGO_SRV } from "./config.json";

export default {
  init: async () => {
    try {
      await mongoose.connect(MONGO_SRV);
      console.log("Connected to MongoDB");
    } catch (e) {
      console.log("Error connecting to MongoDB", e);
    }
  },
  getConnection: () => mongoose.connection,
};
