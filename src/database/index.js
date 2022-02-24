const chalk = require("chalk");
const mongoose = require("mongoose");
const debug = require("debug")("series:database");

const connectToDB = (connectionString) =>
  new Promise((resolve, reject) => {
    debug(chalk.whiteBright("Connecting to database..."));
    mongoose.connect(connectionString, (error) => {
      if (error) {
        const newError = {
          ...error,
          message: `Database error: ${error.message}`,
        };
        reject(newError);
        return;
      }

      debug(
        chalk.whiteBright("Connection to database ") +
          chalk.greenBright("SUCESSFULL")
      );
      resolve();
    });
  });

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

module.exports = connectToDB;
