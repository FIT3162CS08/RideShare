const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signToken = (payload, exp = "1d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // issue a token straight away (like auto-login after signup)
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user._id, email: user.email, role: user.role });

  // httpOnly cookie with secure defaults
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: false, // true on HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });

  return res.json({
    message: "Login successful",
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  });
};

const logout = async (_req, res) => {
  res.clearCookie("access_token", { path: "/" });
  return res.json({ message: "Logged out" });
};

module.exports = {register, login, logout}