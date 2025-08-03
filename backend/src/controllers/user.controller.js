import { User } from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
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
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const host = `${req.protocol}://${req.get("host")}`;
    const imagePath = `${host}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: imagePath },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded and saved successfully",
      imageUrl: imagePath,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error during image upload",
    });
  }
};
