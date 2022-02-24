const Serie = require("../../database/models/Serie");
const User = require("../../database/models/User");
const { listAllSeries, createSerie } = require("./seriesControllers");

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

describe("Given a createSerie controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives 'serie' as body in req", () => {
    test("Then it should call method json with the created serie and a status 201", async () => {
      const res = {
        json: jest.fn(),
      };
      const status = jest.fn().mockReturnValue(res);
      res.status = status;
      const serie = {
        name: "GoT",
      };

      const req = {
        body: serie,
      };
      Serie.create = jest.fn().mockResolvedValue(serie);
      await createSerie(req, res);

      expect(Serie.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(serie);
    });
  });

  describe("When it receives an invalid serie as body in req", () => {
    test("Then it should call next with an error with code 400 and message 'Invalid serie'", async () => {
      const expectedError = expect.objectContaining({
        message: "Invalid serie",
        code: 400,
      });

      const serie = {
        name: "GoT",
      };

      const req = {
        body: serie,
      };

      const next = jest.fn();

      Serie.create = jest.fn().mockRejectedValue();
      await createSerie(req, null, next);

      expect(Serie.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
