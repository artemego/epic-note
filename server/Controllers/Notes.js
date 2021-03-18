const createHttpError = require("http-errors");
const { verifyAccessToken } = require("../helpers/jwt_helper");

module.exports = {
  pages: (req, res, next) => {
    try {
      console.log("got pages");
      res.send("in protected route");
    } catch (err) {
      next(err);
    }
  },
};
