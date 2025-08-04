import { User } from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid name provided",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser.toJSON?.() || updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const host = `${req.protocol}://${req.get("host")}`;
    const imagePath = `${host}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: imagePath },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded and saved successfully",
      imageUrl: imagePath,
      user: updatedUser.toJSON?.() || updatedUser,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error during image upload",
      error: error.message,
    });
  }
};
