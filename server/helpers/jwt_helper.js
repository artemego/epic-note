const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("./init_redis");
const timespan = require("jsonwebtoken/lib/timespan");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const expiresIn = timespan("15 min");
      // console.log("Expiration time: " + expiresIn);
      const options = {
        expiresIn: "15m",
        issuer: "https://github.com/burani",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        // резолвится токен и время, когда истечет его срок действия
        resolve({ accessToken: token, expiresIn });
      });
    });
  },
  // используется для проверки access токена в protected routes.
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    console.log(token);

    // payload == decoded token.
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // Чтобы не показывать, какая именно ошибка с токеном произошла
        console.log("In error");
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      // добавляем расшифрованный access_token на res, чтобы использовать данные в нем в дальнейшем.
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      // Todo: заменить на меньшее время
      const options = {
        expiresIn: "1y",
        issuer: "https://github.com/burani",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        // Сохраняем refreshToken в redis, устанавливаем ttl 1 год
        // По идее мы перезаписываем токен пользователя
        client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          }
          resolve(token);
        });
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          // Достаем userId из refreshToken
          const userId = payload.aud;
          // Ищем refreshToken в redis по userId
          client.GET(userId, (err, result) => {
            // если не найден refreshToken
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            }
            // console.log("Refresh token in database: " + result);
            // console.log("Refresh token in params: " + refreshToken);
            console.log(refreshToken === result);
            // Проверяем, совпадает ли refreshToken от клиента с refreshToken в redis
            if (refreshToken === result) return resolve(userId);
            reject(createError.Unauthorized());
          });
        }
      );
    });
  },
};
