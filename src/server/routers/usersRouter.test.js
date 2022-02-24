require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("..");
const connectDB = require("../../database");
const User = require("../../database/models/User");

let server;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const connectionString = server.getUri();

  await connectDB(connectionString);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("roberto", 10);
  await User.create({
    name: "roboto",
    username: "robot",
    password: cryptPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
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
  });
});
