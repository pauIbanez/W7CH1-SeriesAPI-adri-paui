const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");

const secret = process.env.TOKEN_SECRET;

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

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const error = new Error("Username or password not provided");
    error.code = 400;
    next(error);
    return;
  }

  const userExists = await User.findOne({ username });
  const error = {
    message: "Invalid data",
    code: 401,
  };

  if (!userExists) {
    next(error);
    return;
  }

  const validPassword = await bcrypt.compare(password, userExists.password);

  if (!validPassword) {
    next(error);
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ username, id: userExists._id }, secret);

  res.json({ token });
};

module.exports = { loginUser, createUser };
