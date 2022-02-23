const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { default: helmet } = require("helmet");
const mongoose = require("mongoose");
const usersRouter = require("./routers/usersRouter");
const seriesRouter = require("./routers/seriesRouter");
const { notFoundError, generalPete } = require("./middlewares/errors");

const app = express();

mongoose.set("debug", true);
mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete ret._id;
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete ret.__v;
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.use("/users", usersRouter);

app.use("/series", seriesRouter);

app.use(notFoundError);
app.use(generalPete);

module.exports = app;
