const express = require("express");
const {
  getAllPlatforms,
  createPlatform,
} = require("../controllers/platformsController");

const router = express.Router();

router.get("/", getAllPlatforms);
router.post("/", createPlatform);

module.exports = router;
