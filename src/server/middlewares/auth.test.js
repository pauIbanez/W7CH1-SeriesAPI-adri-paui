const { auth } = require("./auth");

describe("Given auth", () => {
  describe("When it's passed a request without authorization header", () => {
    test("Then it should call next with an error with message 'Token missing'", () => {
      const expectedError = new Error("Token missing");
      const req = {
        header: () => {},
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
