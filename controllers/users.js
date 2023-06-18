require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ИМПОРТ production or not, SECRET KEY
const {
  NODE_ENV, JWT_SECRET, JWT_SECRET_DEV,
} = require("../utils/constants");

// ИМПОРТ ОШИБОК
const {
  USER_NOT_FOUND_ERROR,
  USER_ID_IS_NOT_CORRECT,
  USER_CREATION_DATA_IS_NOT_CORRECT,
  USER_ALREADY_REGISTERED,
  USER_EDIT_PROFILE_DATA_IS_NOT_CORRECT,
} = require("../utils/errors");

const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const ConflictingRequestError = require("../utils/ConflictingRequestError");

const User = require("../models/user");

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: "7d" });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  // console.log("req.params.userId -> ", req.params.userId);
  User.findById(req.user.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError(USER_ID_IS_NOT_CORRECT));
      } else {
        next();
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError(USER_CREATION_DATA_IS_NOT_CORRECT));
      } else if (
        error.code === 11000
      ) {
        next(new ConflictingRequestError(USER_ALREADY_REGISTERED));
      } else {
        next(error);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  // Объект опций для того, чтобы валидировать поля, и чтобы обновить запись в обработчике then
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError(USER_EDIT_PROFILE_DATA_IS_NOT_CORRECT));
      } else if (
        error.code === 11000
      ) {
        next(new ConflictingRequestError(USER_ALREADY_REGISTERED));
      } else {
        next(error);
      }
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(USER_NOT_FOUND_ERROR));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  login,
  getMe,
};
