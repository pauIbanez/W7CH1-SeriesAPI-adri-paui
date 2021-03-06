const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const { createUser, loginUser } = require("./usersControllers");

jest.mock("../../database/models/User");

describe("Given a createUser controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a req with a 'user' in its body", () => {
    test("Then it should call methods create, json and status", async () => {
      const res = {
        json: jest.fn(),
      };
      const status = jest.fn().mockReturnValue(res);
      res.status = status;

      const user = {
        name: "name",
        username: "username",
        password: "password",
      };

      const req = {
        body: user,
      };

      User.create = jest.fn().mockResolvedValue(user);
      await createUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        name: user.name,
        username: user.username,
      });
    });
  });

  describe("When it receives a req with a 'user' in its body but with a missing 'name' field", () => {
    test("Then it should return an error with message 'Not all fields are filled' and code 400", async () => {
      const next = jest.fn();

      const user = {
        name: "",
        username: "username",
        password: "password",
      };

      const req = {
        body: user,
      };

      const expectedError = expect.objectContaining({
        code: 400,
        message: "Please fill the blank fields",
      });

      User.create = jest.fn().mockResolvedValue(user);
      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a req with a 'user' in its body but it's already taken", () => {
    test("Then it should return an error with message 'Username already taken' and code 409", async () => {
      const user = {
        name: "name",
        username: "username",
        password: "password",
      };

      const req = {
        body: user,
      };

      const next = jest.fn();

      const expectedError = expect.objectContaining({
        code: 409,
        message: "Username already taken",
      });

      User.create = jest.fn().mockRejectedValue({});
      await createUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given loginUser", () => {
  describe("When it's passed a req and a res with username and password that are ok", () => {
    test("Then it should call method json of res", async () => {
      const password = "1234";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
        username: "paquito",
        password,
      };

      const databaseUser = {
        username: "paquito",
        password: hashedPassword,
      };
      const token = "thisAToken";
      User.findOne = jest.fn().mockResolvedValue(databaseUser);
      jwt.sign = jest.fn().mockReturnValue(token);

      const req = {
        body: user,
      };

      const res = {
        json: jest.fn(),
      };

      await loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ username: user.username });
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it's passed a req and a res without a username", () => {
    test("Then it should call next with an error with code 400 and message 'Username or password not provided'", async () => {
      const password = "1234";
      const user = {
        password,
      };

      const req = {
        body: user,
      };

      const expectedError = expect.objectContaining({
        code: 400,
        message: "Username or password not provided",
      });

      const next = jest.fn();

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's passed a req and a res with username and an invalid password", () => {
    test("Then it should call next with an error with code 401 and message 'Invalid data'", async () => {
      const password = "1324";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
        username: "paquito",
        password: "12345",
      };

      const databaseUser = {
        username: "paquito",
        password: hashedPassword,
      };

      const expectedError = expect.objectContaining({
        code: 401,
        message: "Invalid data",
      });

      User.findOne = jest.fn().mockResolvedValue(databaseUser);

      const next = jest.fn();

      const req = {
        body: user,
      };

      await loginUser(req, null, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: user.username });
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's passed a req and a res with a non existent username and a password", () => {
    test("Then it should call next with an error with code 401 and message 'Invalid data'", async () => {
      const user = {
        username: "tydgfddh",
        password: "12345",
      };

      const expectedError = expect.objectContaining({
        code: 401,
        message: "Invalid data",
      });

      User.findOne = jest.fn().mockResolvedValue(null);

      const next = jest.fn();

      const req = {
        body: user,
      };

      await loginUser(req, null, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: user.username });
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
