require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  JWT_SECRET_DEV, NODE_ENV, JWT_SECRET,
} = require("../utils/constants");

const UnauthorizedError = require("../utils/UnauthorizedError");

// ИМПОРТ ОШИБОК
const {
  AUTHORIZATION_REQUIRED,
  WRONG_DATA_RECIEVIED,

} = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError(AUTHORIZATION_REQUIRED));
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    next(new UnauthorizedError(WRONG_DATA_RECIEVIED));
  }
  req.user = payload;
  next();
};
