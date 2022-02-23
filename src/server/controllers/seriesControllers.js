const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");

const listAllSeries = async (req, res, next) => {
  const { id } = req.user;
  let errorMessage = "User not found";
  try {
    const user = await User.findById(id);
    errorMessage = "Series not found in the database";
    const userSerires = await Serie.find({ id: { $in: user.series } });
    res.json({ series: userSerires });
  } catch (error) {
    const newError = { ...error };
    newError.code = 404;
    newError.message = errorMessage;
    next(error);
  }
};

module.exports = { listAllSeries };
