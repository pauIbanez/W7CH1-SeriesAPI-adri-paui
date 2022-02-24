require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("..");

const connectDB = require("../../database");
const User = require("../../database/models/User");
const Platform = require("../../database/models/Platform");

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

  const platform = { name: "Netflix" };

  await Platform.create(platform);
});

afterEach(async () => {
  await User.deleteMany({});
  await Platform.deleteMany({});
});

describe("Given a /platforms endpoint", () => {
  describe("When it receives a GET request with token", () => {
    test("Then it should respond with json containing 'platforms'", async () => {
      const platforms = "Netflix";
      const url = "/platforms";

      const { body } = await request(app)
        .get(url)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(body.platforms[0].name).toBe(platforms);
    });
  });

  describe("When it receives a GET request with a wrong token", () => {
    test("Then it should respond with an error message 'Wrong token'", async () => {
      const wrongToken = "sfddsv";
      const url = "/platforms";
      const errorMessage = { error: "Wrong token" };

      const { body } = await request(app)
        .get(url)
        .set("Authorization", `Bearer ${wrongToken}`);

      expect(body).toEqual(errorMessage);
    });
  });

  describe("When it receives a POST request with a 'platform' and valid token", () => {
    test("Then it should respond with json with the new platform and status 201", async () => {
      const url = "/platforms";
      const platform = { name: "HBO" };

      const { body } = await request(app)
        .post(url)
        .send(platform)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      expect(body).toHaveProperty("name", "HBO");
    });
  });

  describe("When it receives a POST request with a 'platform' and wrong token", () => {
    test("Then it should respond with json with an error message 'Wrong token'", async () => {
      const url = "/platforms";
      const platform = { name: "HBO" };
      const wrongToken = "sfddsv";
      const errorMessage = { error: "Wrong token" };

      const { body } = await request(app)
        .post(url)
        .send(platform)
        .set("Authorization", `Bearer ${wrongToken}`)
        .expect(401);

      expect(body).toEqual(errorMessage);
    });
  });
});
