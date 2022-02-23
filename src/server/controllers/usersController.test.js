const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const { loginUser } = require("./usersControllers");

jest.mock("../../database/models/User");

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
    test("Then it should call method json of res", async () => {
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
});
