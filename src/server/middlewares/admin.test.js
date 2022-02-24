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

  describe("When it's passed a request with a user id of a user that is not an admin", () => {
    test("Then it should call next with an error with message 'Admin acces required'", async () => {
      const next = jest.fn();
      const req = {
        user: {
          id: "invalidId",
        },
      };
      const user = {
        name: "asdasdas",
        id: "adminId",
      };

      const expectedError = expect.objectContaining({
        code: 401,
        message: "Admin acces required",
      });

      User.findById = jest.fn().mockResolvedValue(user);

      await admin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's passed a request with a user id of a non existent user", () => {
    test("Then it should call next with an empty object", async () => {
      const next = jest.fn();
      const req = {
        user: {
          id: "invalidId",
        },
      };

      const expectedError = {};

      User.findById = jest.fn().mockResolvedValue(null);

      await admin(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
