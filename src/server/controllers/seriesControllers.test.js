const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");
const { listAllSeries } = require("./seriesControllers");

jest.mock("../../database/models/User");

describe("Given a listAllSeries controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a req with a 'user' whith 2 series id's", () => {
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

      User.create = jest.fn().mockResolvedValue(user);
      Serie.find = jest.fn().mockResolvedValue(series);
      await listAllSeries(req, res);

      expect(res.json).toHaveBeenCalledWith({ series });
    });
  });
});
