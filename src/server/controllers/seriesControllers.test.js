const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");
const { listAllSeries } = require("./seriesControllers");

jest.mock("../../database/models/User");

describe("Given a listAllSeries controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a req with a user whith 2 series id's", () => {
    test("Then it should call json with the found series", async () => {
      const res = {
        json: jest.fn(),
      };

      const user = {
        id: "2",
        username: "username",
        password: "password",
        series: ["4", "thisASerie"],
      };

      const req = {
        user,
      };

      const series = [
        {
          name: "serie wone",
          id: "4",
        },
        {
          name: "serie tu",
          id: "thisASerie",
        },
      ];

      User.findById = jest.fn().mockResolvedValue(user);
      Serie.find = jest.fn().mockResolvedValue(series);
      await listAllSeries(req, res);

      expect(res.json).toHaveBeenCalledWith({ series });
    });
  });

  describe("When it receives a req with a non existent user", () => {
    test("Then it should call next with the message 'User not found'", async () => {
      const user = {
        id: "2",
        username: "username",
        password: "password",
        series: ["4", "thisASerie"],
      };

      const req = {
        user,
      };

      const expectedError = expect.objectContaining({
        message: "User not found",
        code: 404,
      });
      const next = jest.fn();

      User.create = jest.fn().mockResolvedValue(user);

      await listAllSeries(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a req with user whith 2 series id' but none are in the db", () => {
    test("Then it should call json of res with an empty array", async () => {
      const res = {
        json: jest.fn(),
      };

      const user = {
        id: "2",
        username: "username",
        password: "password",
        series: ["4", "thisASerie"],
      };

      const req = {
        user,
      };

      User.findById = jest.fn().mockResolvedValue(user);
      Serie.find = jest.fn().mockResolvedValue(null);
      await listAllSeries(req, res);

      expect(res.json).toHaveBeenCalledWith({ series: [] });
    });
  });
});
