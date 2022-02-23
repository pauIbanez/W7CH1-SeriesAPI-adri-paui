const express = require("express");
const { listAllSeries } = require("../controllers/seriesController");

const router = express.Router();

router.get("/", listAllSeries);

module.exports = router;
