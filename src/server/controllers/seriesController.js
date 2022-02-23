const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");

const listAllSeries = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    const userSerires = await Serie.find({ id: { $in: user.series } });
    res.json({ series: userSerires });
  } catch (error) {
    next(error);
  }
};

module.exports = { listAllSeries };
