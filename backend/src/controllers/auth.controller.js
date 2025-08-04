import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    const freshUser = await User.findById(user._id);

    res.json({
      success: true,
      message: "Login successful",
      user: freshUser.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user.toJSON() });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching user data",
      error: error.message,
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar || user.avatar;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId, avatar });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: "Google authentication successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
      error: error.message,
    });
  }
};
