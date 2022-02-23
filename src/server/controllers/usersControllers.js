const User = require("../../database/models/User");

const createUser = async (req, res, next) => {
  const newUser = req.body;
  try {
    await User.create(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    error.code = 409;
    error.message = "Username already taken";
    next(error);
  }
};

module.exports = { createUser };
