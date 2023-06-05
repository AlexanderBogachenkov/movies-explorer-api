require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const ConflictingRequestError = require("../utils/ConflictingRequestError");

const User = require("../models/user");

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "some-secret-key", { expiresIn: "7d" });

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
        next(new NotFoundError("Пользователь по указанному _id не найден"));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Передан некорректный ID пользователя"));
      } else {
        next();
      }
    });
};

const createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    // eslint-disable-next-line object-curly-newline
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при создании пользователя"));
      } else if (
        error.code === 11000
      ) {
        next(new ConflictingRequestError("Такой пользователь уже зарегистрирован"));
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
        next(new NotFoundError("Пользователь с таким идентификатором не найден"));
      } else {
        res.send(user);
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при редактировании профиля пользователя"));
      } else if (
        error.code === 11000
      ) {
        next(new ConflictingRequestError("Такой пользователь уже зарегистрирован"));
      } else {
        next(error);
      }
    });
};

const getMe = (req, res, next) => {
  // console.log("req.user._id -> ", req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь с таким идентификатором не найден"));
      } else {
        // res.send({ data: user });
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
