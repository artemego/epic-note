const createHttpError = require("http-errors");

const User = require("../models/User");
const { authSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const client = require("../helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
    try {
      // проверка на правильность структуры login и password
      const result = await authSchema.validateAsync(req.body);
      // проверка на то, существует ли уже пользователь с данным email
      const doesExist = await User.findOne({ email: result.email });
      if (doesExist)
        throw createHttpError.Conflict(
          `${result.email} has already been registered`
        );

      // создаем нового пользователя и сохраняем его, далее сайним ему access и refresh токены и отправляем их на клиент
      const user = new User(result);
      const savedUser = await user.save();
      const { accessToken, expiresIn } = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.cookie(
        "JWT",
        { refreshToken },
        { maxAge: 86_400_000, httpOnly: true }
      );

      res.send({ accessToken, expiresIn });
    } catch (error) {
      // if it's validation error change status to 422
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      // проверка на правильность структуры login и password
      const result = await authSchema.validateAsync(req.body);
      // проверка на то, существует ли уже пользователь с данным email. Если нет, то происходит ошибка
      const user = await User.findOne({ email: result.email });

      if (!user) throw createHttpError.NotFound("User not registered");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createHttpError.Unauthorized("Invalid username/password");

      const { accessToken, expiresIn } = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      //создаем http-only cookie и добавляем его на res
      res.cookie(
        "JWT",
        { refreshToken },
        { maxAge: 86_400_000, httpOnly: true }
      );

      res.send({ accessToken, expiresIn });
    } catch (error) {
      if (error.isJoi == true)
        return next(createHttpError.BadRequest("Invalid username/password"));
      next(error);
    }
  },
  // метод обновляет токены пользователя
  refreshToken: async (req, res, next) => {
    try {
      // Todo: переписать на cookie
      // достаем refresh token из req.cookies
      // console.log("cookies: " + req.cookies.JWT.refreshToken);
      const { refreshToken } = req.cookies.JWT;
      // Если его нет, то создаем ошибку
      if (!refreshToken) throw createHttpError.BadRequest();
      // Verify refresh token in the request
      const userId = await verifyRefreshToken(refreshToken);
      // sign new refresh/access tokens
      const { accessToken, expiresIn } = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      // создаем cookie
      // refToken - новый refresh token.
      res.cookie(
        "JWT",
        { refreshToken: refToken },
        { maxAge: 86_400_000, httpOnly: true }
      );
      res.send({ accessToken, expiresIn });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies.JWT;
      if (!refreshToken) throw createHttpError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createHttpError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
};
