const express = require("express");
const {
  listAllSeries,
  createSerie,
} = require("../controllers/seriesControllers");

const router = express.Router();

router.get("/", listAllSeries);
router.post("/", createSerie);

module.exports = router;
