const createHttpError = require("http-errors");

const Page = require("../models/Page");
const User = require("../models/User");

const { authSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const client = require("../helpers/init_redis");
const shortid = require("shortid");
const { mockPages } = require("../mockdata");

const checkIfTokenExists = (obj) => {
  if (obj && obj.refreshToken && Object.keys(obj.refreshToken).length) {
    return true;
  }
  return false;
};

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
      await user.hashPassword();
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
  registerGuest: async (req, res, next) => {
    try {
      // generate guest user email and password
      const guestId = shortid();
      const guestObj = {
        email: `Guest${guestId}@epicnote.com`,
        password: "guest",
        isGuest: true,
      };
      // проверка на коллизию
      const doesExist = await User.findOne({ email: guestObj.email });
      if (doesExist) {
        throw createHttpError.Conflict(
          `${result.email} has already been registered`
        );
      }
      const user = new User(guestObj);
      await user.hashPassword();
      const savedUser = await user.save();
      const userId = savedUser.id;
      const { accessToken, expiresIn } = await signAccessToken(userId);
      const refreshToken = await signRefreshToken(userId);

      // generate mock pages and insert them into pages collection and guest user pageObj

      // make pages to insert
      const pages = mockPages.map((mockPage) => {
        const page = new Page({
          blocks: mockPage.blocks,
          creator: userId,
          name: mockPage.name,
        });
        return page;
      });

      // insert mock pages
      const savedPages = await Page.insertMany(pages);

      // insert page ids into user collection
      savedPages.forEach((page) => {
        user.pages.pageItems.push({
          id: page._id.toString(),
          children: [],
          hasChildren: false,
          isExpanded: false,
          isChildrenLoading: false,
          data: {
            title: page.name,
          },
        });
        user.pages.rootIds.push(page._id.toString());
      });

      await user.save();

      res.cookie(
        "JWT",
        { refreshToken },
        { maxAge: 86_400_000, httpOnly: true }
      );
      res.send({ accessToken, expiresIn });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  },
  login: async (req, res, next) => {
    // console.log(req.body);
    // console.log(req);
    try {
      // проверка на правильность структуры login и password
      const result = await authSchema.validateAsync(req.body);
      // проверка на то, существует ли уже пользователь с данным email. Если нет, то происходит ошибка
      const user = await User.findOne({ email: result.email });
      // console.log(req.body);
      // console.log(result);

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
      if (!checkIfTokenExists(req.cookies.JWT))
        throw createHttpError.BadRequest();
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
      if (!checkIfTokenExists(req.cookies.JWT))
        throw createHttpError.BadRequest();
      const { refreshToken } = req.cookies.JWT;
      if (!refreshToken) throw createHttpError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          // console.log(err.message);
          // Todo: здесь наверное тоже надо удалить куки у пользователя
          throw createHttpError.InternalServerError();
        }
        // удаляем куки и отправляем ответ
        res.cookie("JWT", "none", {
          expires: new Date(Date.now() + 5 * 1000),
          httpOnly: true,
        });
        res
          .status(200)
          .json({ success: true, message: "User logged out successfully" });

        // console.log(val);
        // res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
  // get user info
  info: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      // console.log(userId);
      const user = await User.findById(userId);
      if (!user) {
        const err = new Error("Could not find user by id.");
        err.statusCode = 404;
        throw err;
      }

      const info = {
        email: user.email,
      };
      res.status(200).json({
        message: "user info",
        info,
      });
    } catch (err) {
      next(err);
    }
  },
};
