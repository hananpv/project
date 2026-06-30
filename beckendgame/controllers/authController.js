const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const userResponse = (user) => ({
  id: user._id.toString(),
  _id: user._id,
  name: user.name,
  username: user.username || user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  tier: user.tier,
  createdAt: user.createdAt,
});

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const displayName = name || username;

    if (!displayName || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: displayName,
      username: (username || displayName).trim().toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      user: userResponse(user),
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const loginIdentifier = email.trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier },
        { username: loginIdentifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: userResponse(user),
      token: createToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userResponse(user));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};
