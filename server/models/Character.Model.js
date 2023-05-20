import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    class: {
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

const Character = mongoose.model("Character", CharacterSchema);

export default Character;
