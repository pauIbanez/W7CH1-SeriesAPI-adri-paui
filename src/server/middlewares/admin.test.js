const User = require("../../database/models/User");
const admin = require("./admin");

describe("Given admin", () => {
  describe("When it's passed a request with a user id of a user that is an admin", () => {
    test("Then it should call next without nothing", async () => {
      const next = jest.fn();
      const req = {
        user: {
          id: "adminId",
        },
      };
      const user = {
        name: "asdasdas",
        id: "adminId",
        admin: true,
      };

      User.findById = jest.fn().mockResolvedValue(user);

      await admin(req, null, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
