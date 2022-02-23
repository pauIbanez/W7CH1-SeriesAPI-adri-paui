require("dotenv").config();
const debug = require("debug")("series:root");
const initializeServer = require("./server/initializeServer");
const app = require("./server/index");
const connectToDB = require("./database");

const port = process.env.PORT || 4000;
const connectionString = process.env.MONGODB_URI;

(async () => {
  try {
    await connectToDB(connectionString);
    await initializeServer(port, app);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
