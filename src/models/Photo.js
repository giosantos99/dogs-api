import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acessos: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
