const User = require("../../database/models/User");

const admin = async (req, res, next) => {
  const { user } = req;

  const foundUser = await User.findById(user.id);
  if (!foundUser) {
    next({});
    return;
  }
  if (!foundUser.admin) {
    const error = new Error("Admin acces required");
    error.code = 401;
    next(error);
    return;
  }
  next();
};

module.exports = admin;
