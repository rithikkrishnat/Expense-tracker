// backend/controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ===================
// Register User
// ===================
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body;

  // Validate input
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user, mapping profilePic → profileImageUrl
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl: profilePic || null,
    });

    // Return success response, including the image URL
    res.status(201).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

// ===================
// Login User
// ===================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return success response
    res.status(200).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
};

// ===================
// Get Current User
// ===================
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send full user object (including profileImageUrl)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user info",
      error: err.message,
    });
  }
};
