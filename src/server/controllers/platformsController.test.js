const Platform = require("../../database/models/Platform");
const { getAllPlatforms } = require("./platformsController");

jest.mock("../../database/models/User");

describe("Given a getAllPlatforms controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it's invoked", () => {
    test("Then it should call method json with a list of robots of the received response", async () => {
      const res = {
        json: jest.fn(),
      };
      const platforms = [
        {
          name: "Netflix",
          series: ["me", "encanta", "testear"],
        },
        {
          name: "HBO",
          series: ["wow", "like"],
        },
      ];
      Platform.find = jest.fn().mockResolvedValue(platforms);

      await getAllPlatforms(null, res);

      expect(Platform.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ platforms });
    });
  });
});
