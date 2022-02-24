const Platform = require("../../database/models/Platform");
const { getAllPlatforms, createPlatform } = require("./platformsController");

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

describe("Given a createPlatform controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives 'platform' as body in req", () => {
    test("Then it should call method json with the created platform and a status 201", async () => {
      const res = {
        json: jest.fn(),
      };
      const status = jest.fn().mockReturnValue(res);
      res.status = status;
      const platform = {
        name: "Netflix",
        series: ["me", "encanta", "testear"],
      };

      const req = {
        body: platform,
      };
      Platform.create = jest.fn().mockResolvedValue(platform);
      await createPlatform(req, res);

      expect(Platform.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(platform);
    });
  });

  describe("When it receives an invalid platform as body in req", () => {
    test("Then it should call next with an error with code 400 and message 'Invalid platform'", async () => {
      const expectedError = expect.objectContaining({
        message: "Invalid platform",
        code: 400,
      });

      const platform = {
        name: "Netflix",
        series: ["me", "encanta", "testear"],
      };

      const req = {
        body: platform,
      };

      const next = jest.fn();

      Platform.create = jest.fn().mockRejectedValue();
      await createPlatform(req, null, next);

      expect(Platform.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
