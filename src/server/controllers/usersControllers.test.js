const User = require("../../database/models/User");
const { createUser } = require("./usersControllers");

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
