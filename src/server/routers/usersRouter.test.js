const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const request = require("supertest");

const { MongoMemoryServer } = require("mongodb-memory-server");
const connectToDB = require("../../database");
const User = require("../../database/models/User");
const app = require("..");

let mongoServer;
const user = {
  name: "Test User",
  username: "testUsername",
  password: "1234",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToDB(connectionString);
});

beforeEach(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  await User.create({
    name: user.name,
    username: user.username,
    password: hashedPassword,
  });
  console.log("user created");
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given /users/login endpoint", () => {
  describe("When it recieves a requeist with everything ok", () => {
    test("Then it should return a token", async () => {
      const userToSend = {
        username: user.username,
        password: user.password,
      };
      await request(app)
        .post("/users/login")
        .send({ username: user.username, password: "1234" })
        .expect(200);
    });
  });
});
