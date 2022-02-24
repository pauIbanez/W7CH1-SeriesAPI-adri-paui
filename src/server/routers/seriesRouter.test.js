require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("..");

const connectDB = require("../../database");
const User = require("../../database/models/User");

let mongoServer;
let token;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectDB(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const user = {
    name: "roboto",
    username: "robot",
    password: "roberto",
    admin: true,
  };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  await User.create({
    name: "roboto",
    username: "robot",
    password: hashedPassword,
    admin: true,
  });

  const { body } = await request(app).post("/users/login").send(user);
  token = body.token;
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /series endpoint", () => {
  describe("When it receives a GET request with token", () => {
    test("Then it should respond with json containing 'series'", async () => {
      const series = [];
      const url = "/series";

      const { body } = await request(app)
        .get(url)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body.series).toEqual(series);
    });
  });

  describe("When it receives a GET request with a wrong token", () => {
    test("Then it should respond with an error message 'Wrong token'", async () => {
      const wrongToken = "sfddsv";
      const url = "/series";
      const errorMessage = { error: "Wrong token" };

      const { body } = await request(app)
        .get(url)
        .set("Authorization", `Bearer ${wrongToken}`);

      expect(body).toEqual(errorMessage);
    });
  });
});
