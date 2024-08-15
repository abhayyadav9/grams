import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true, // Fixed: Changed `require` to `required`
    },

    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId, // Fixed: Changed `String.mongoose.Schema.Types.ObjectId` to `mongoose.Schema.Types.ObjectId`
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId, // Fixed: Changed `String.mongoose.Schema.Types.ObjectId` to `mongoose.Schema.Types.ObjectId`
        ref: "User",
      },
    ],

    post: [
      {
        type: mongoose.Schema.Types.ObjectId, // Fixed: Changed `String.mongoose.Schema.Types.ObjectId` to `mongoose.Schema.Types.ObjectId`
        ref: "Post",
      },
    ],

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId, // Fixed: Changed `String.mongoose.Schema.Types.ObjectId` to `mongoose.Schema.Types.ObjectId`
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
