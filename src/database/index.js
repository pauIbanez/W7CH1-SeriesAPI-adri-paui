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

module.exports = connectToDB;
