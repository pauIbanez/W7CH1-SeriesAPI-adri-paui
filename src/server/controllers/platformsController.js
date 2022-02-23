const Platform = require("../../database/models/Platform");

const getAllPlatforms = async (req, res) => {
  const platforms = await Platform.find();
  res.json({ platforms });
};

const createPlatform = async (req, res) => {
  const newPlatform = req.body;
  const createdPlatform = await Platform.create(newPlatform);
  res.status(201).json(createdPlatform);
};
module.exports = { getAllPlatforms, createPlatform };
