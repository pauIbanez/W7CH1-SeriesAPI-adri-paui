const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");

const listAllSeries = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.code = 404;
      next(error);
      return;
    }

    const userSerires = await Serie.find({ id: { $in: user.series } });
    if (!userSerires) {
      const error = new Error("Series not found in the database");
      error.code = 404;
      next(error);
      return;
    }
    res.json({ series: userSerires });
  } catch (error) {
    next(error);
  }
};

module.exports = { listAllSeries };
