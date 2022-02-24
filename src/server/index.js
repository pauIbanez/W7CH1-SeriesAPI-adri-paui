const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { default: helmet } = require("helmet");
const usersRouter = require("./routers/usersRouter");
const seriesRouter = require("./routers/seriesRouter");
const { notFoundError, generalPete } = require("./middlewares/errors");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/users", usersRouter);

app.use("/series", seriesRouter);

app.use(notFoundError);
app.use(generalPete);

module.exports = app;
