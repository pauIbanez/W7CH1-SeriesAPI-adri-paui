const express = require("express");
const { listAllSeries } = require("../controllers/seriesControllers");

const router = express.Router();

router.get("/", listAllSeries);

module.exports = router;
