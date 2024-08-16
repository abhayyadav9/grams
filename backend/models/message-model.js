import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({ // Fixed typo
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true, // Fixed typo
  },
});

export const Message = mongoose.model("Message", messageSchema); // Fixed typo
