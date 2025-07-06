const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error - " + error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({
      message: "Loggedin Successfully",
      data: user._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error - " + err,
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    const token = res.clearCookie("auth_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.json({ message: "Logout Sucessfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error in Logout Module " + err,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const deleteaccount = await User.findOneAndDelete({ email });

    if (!deleteaccount) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error in Delete Module " + error,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { email, name, phone } = req.body;
    const userData = await User.findByIdAndUpdate(
      id,
      { name, phone, email },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({
      message: " Profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in Update Profile Module " + error,
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const userData = await User.findById(id).select("-password");
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({ data: userData });
  } catch (error) {
    return res.status(500).json({
      meaage: "error in profile " + error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  deleteUser,
  updateProfile,
  userProfile,
};
