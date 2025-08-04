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

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      sortBy = "createdAt",
      sortOrder = "asc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select("name email role active"),
      User.countDocuments(filter),
    ]);

    const hasMore = skip + users.length < total;

    res.status(200).json({
      users,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "super_admin" ? "user" : "super_admin";
    await user.save();

    res.status(200).json({ success: true, message: "Role updated", user });
  } catch (error) {
    console.error("Error toggling role:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
