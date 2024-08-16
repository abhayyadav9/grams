import { User } from "../models/user-models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Added import for jwt
import cloudinary from "../database/cloudinary.js";
import getDataUri  from "../utils/datauri.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      // Changed `username` to `name`
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Changed `hassedPassword` to `hashedPassword`

    await User.create({
      username, // Changed `username` to `name`
      email,
      password: hashedPassword, // Changed `hassedPassword` to `hashedPassword`
    });
    res.json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};










export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }

    
    const token = await jwt.sign(
      {
        userId: user._id, // Changed `user._id` to `user.id`
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    
    user = {
      _id: user._id,
      username: user.username, // Changed `username` to `name`
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict", // Changed `sasmeSite` to `sameSite`
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: `Welcome back ${user.name}`, success: true, user }); // Changed `username` to `name`
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  // Added `req` and `res` parameters
  try {
    return res.clearCookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false }); // Fixed: Added error response for server errors
  }
};

/// edit Your progile



export const editProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.file;
      let cloudResponse;

      if (profilePicture) {
          const fileUri = getDataUri(profilePicture);
          cloudResponse = await cloudinary.uploader.upload(fileUri);
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({
              message: 'User not found.',
              success: false
          });
      };
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePicture) user.profilePicture = cloudResponse.secure_url;

      await user.save();

      return res.status(200).json({
          message: 'Profile updated.',
          success: true,
          user
      });

  } catch (error) {
      console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  // Fixed: Corrected parameter order from (res, req) to (req, res)
  try {
    const getSuggestedUsers = await User.find({
      // Fixed: Kept variable name as getSuggestedUsers
      _id: { $ne: req.id },
    }).select("-password");

    if (getSuggestedUsers.length === 0) {
      // Fixed: Used length check for empty array
      return res
        .status(404)
        .json({ message: "No users found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Suggested users", success: true, getSuggestedUsers }); // Fixed: Kept variable name as getSuggestedUsers
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false }); // Fixed: Added error response
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKarnewala = req.id; // Kept variable name as followKarnewala
    const jiskoFollowKarunga = req.params.id; // Kept variable name as jiskoFollowKarunga

    if (followKarnewala === jiskoFollowKarunga) {
      return res
        .status(400)
        .json({ message: "You can't follow yourself", success: false });
    }

    const user = await User.findById(followKarnewala);
    const targetUser = await User.findById(jiskoFollowKarunga);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Now checking follow or unfollow
    const isFollowing = user.following.includes(jiskoFollowKarunga);
    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarnewala },
          { $pull: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $pull: { followers: followKarnewala } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      // Follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKarnewala },
          { $push: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $push: { followers: followKarnewala } }
        ),
      ]);
      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error); // Fixed: Added error logging
    return res.status(500).json({ message: "Server error", success: false }); // Fixed: Added error response
  }
};
