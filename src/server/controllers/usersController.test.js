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
});
