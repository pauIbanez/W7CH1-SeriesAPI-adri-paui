const express = require("express");
const {
  getAllPlatforms,
  createPlatform,
} = require("../controllers/platformsController");
const admin = require("../middlewares/admin");

const router = express.Router();

router.get("/", getAllPlatforms);
router.post("/", admin, createPlatform);

module.exports = router;
