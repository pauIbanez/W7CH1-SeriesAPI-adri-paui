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
});
