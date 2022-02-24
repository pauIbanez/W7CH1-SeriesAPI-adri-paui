const Platform = require("../../database/models/Platform");

const getAllPlatforms = async (req, res) => {
  const platforms = await Platform.find();
  res.json({ platforms });
};

const createPlatform = async (req, res, next) => {
  try {
    const newPlatform = req.body;
    const createdPlatform = await Platform.create(newPlatform);
    res.status(201).json(createdPlatform);
  } catch (error) {
    const newError = new Error("Invalid platform");
    newError.code = 400;
    next(newError);
  }
};
module.exports = { getAllPlatforms, createPlatform };
