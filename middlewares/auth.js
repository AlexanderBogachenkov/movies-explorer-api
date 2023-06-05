require("dotenv").config();
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require("../utils/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Необходима авторизация"));
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "some-secret-key");
  } catch (err) {
    // eslint-disable-next-line consistent-return
    return next(new UnauthorizedError("Переданы неверные данные"));
  }

  req.user = payload; // записываем payload в объект запроса

  next(); // пропускаем запрос дальше
};
