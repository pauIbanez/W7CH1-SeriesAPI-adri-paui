require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");

const { MongoMemoryServer } = require("mongodb-memory-server");
const connectToDB = require("../../database");
const app = require("..");
const User = require("../../database/models/User");

let mongoServer;
const user = {
  name: "Test User",
  username: "testUsername",
  password: "1234",
};

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("roberto", 10);
  await User.create({
    name: "roboto",
    username: "robot",
    password: cryptPassword,
  });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  await User.create({
    name: user.name,
    username: user.username,
    password: hashedPassword,
  });
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToDB(connectionString);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a users/register endpoint", () => {
  describe("When it receives a post request with an existing user", () => {
    test("Then it should respond with an error message 'Username already taken'", async () => {
      const user = { name: "roboto", username: "robot", password: "roberto" };

      const errorMessage = "Username already taken";

      const {
        body: { error },
      } = await request(app).post("/users/register").send(user).expect(409);

      expect(error).toBe(errorMessage);
    });
  });

  describe("When it receives a post request with a valid user", () => {
    test("Then it should respond with a status 201 and a json with name and username ", async () => {
      const user = { name: "alex", username: "alexito94", password: "roberto" };
      const expectedResponse = { name: "alex", username: "alexito94" };

      const { body } = await request(app)
        .post("/users/register")
        .send(user)
        .expect(201);

      expect(body.username).toBe(user.username);
      expect(body).toEqual(expectedResponse);
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
