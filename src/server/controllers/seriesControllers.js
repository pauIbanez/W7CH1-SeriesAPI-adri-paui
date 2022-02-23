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

module.exports = { listAllSeries };
