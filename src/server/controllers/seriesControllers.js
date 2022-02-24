const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");

const listAllSeries = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    next(error);
    return;
  }

  let userSerires = await Serie.find({ id: { $in: user.series } });

  if (!userSerires) {
    userSerires = [];
  }
  res.json({ series: userSerires });
};

const createSerie = async (req, res, next) => {
  try {
    const newSerie = req.body;
    const createdSerie = await Serie.create(newSerie);
    res.status(201).json(createdSerie);
  } catch (error) {
    const newError = new Error("Invalid serie");
    newError.code = 400;
    next(newError);
  }
};

module.exports = { listAllSeries, createSerie };
