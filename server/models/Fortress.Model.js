import mongoose from "mongoose";

const FortressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Fortress = mongoose.model("Fortress", FortressSchema);

export default Fortress;
