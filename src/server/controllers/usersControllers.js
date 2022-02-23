const bcrypt = require("bcrypt");
const User = require("../../database/models/User");

const createUser = async (req, res, next) => {
  const { name, username, password, admin } = req.body;
  if (!name || !username || !password || !admin) {
    const error = new Error("Not all fields are filled");
    error.code = 400;
    next(error);
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, username, hashedPassword, admin });
    res.status(201).json({ name, username });
  } catch (error) {
    error.code = 409;
    error.message = "Username already taken";
    next(error);
  }
};

module.exports = { createUser };
