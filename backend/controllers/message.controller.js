import { Conversation } from "../models/conversation-model.js";
import { Message } from "../models/message-model.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message content is required",
        success: false,
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(200).json({
      message: "Message sent successfully",
      success: true,
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      message: "Failed to send message",
      success: false,
      error: error.message,
    });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res
        .status(404)
        .json({ message: "Conversation not found", success: false });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
    
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({
      message: "Failed to retrieve messages",
      success: false,
      error: error.message,
    });
  }
};
