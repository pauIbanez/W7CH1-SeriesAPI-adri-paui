const express = require("express");
const {
  listAllSeries,
  createSerie,
} = require("../controllers/seriesControllers");
const admin = require("../middlewares/admin");

const router = express.Router();

router.get("/", listAllSeries);
router.post("/", admin, createSerie);

module.exports = router;
