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
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given /users/login endpoint", () => {
  describe("When it recieves a request with everything ok", () => {
    test("Then it should return a token", async () => {
      const userToSend = {
        username: user.username,
        password: user.password,
      };
      const {
        body: { token },
      } = await request(app).post("/users/login").send(userToSend).expect(200);

      expect(token).toBeTruthy();
    });
  });

  describe("When it recieves a request without username or password", () => {
    test("Then it should return 400 with error message 'Invalid data'", async () => {
      const userToSend = {};
      const {
        body: { error },
      } = await request(app).post("/users/login").send(userToSend).expect(400);

      expect(error).toBe("Username or password not provided");
    });
  });

  describe("When it recieves a requeist without an invalid username", () => {
    test("Then it should return 401 with error message 'Invalid data'", async () => {
      const userToSend = {
        username: "asdasd",
        password: "xd",
      };
      const {
        body: { error },
      } = await request(app).post("/users/login").send(userToSend).expect(401);

      expect(error).toBe("Invalid data");
    });
  });

  describe("When it recieves a requeist without an invalid password", () => {
    test("Then it should return 401 with error message 'Invalid data'", async () => {
      const userToSend = {
        username: user.username,
        password: "xd",
      };
      const {
        body: { error },
      } = await request(app).post("/users/login").send(userToSend).expect(401);

      expect(error).toBe("Invalid data");
    });
  });
});
