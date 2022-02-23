const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");

const secret = process.env.TOKEN_SECRET;

const createUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    const error = new Error("Please fill the blank fields");
    error.code = 400;
    next(error);
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, username, hashedPassword });
    res.status(201).json({ name, username });
  } catch (error) {
    error.code = 409;
    error.message = "Username already taken";
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const eror = new Error("Username or password not provided");
    eror.code = 400;
    next(eror);
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
