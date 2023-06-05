const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // импортируем bcrypt
const isEmail = require("validator/lib/isEmail");
// const isUrl = require("validator/lib/isURL");
const UnauthorizedError = require("../utils/UnauthorizedError");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "не передано имя пользователя"],
      minlength: [
        2,
        "длина имени пользователя должна быть не менее 2 символов",
      ],
      maxlength: [
        30,
        "длина имени пользователя должна быть не более 30 символов",
      ],
      // default: "Жак-Ив Кусто",
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: isEmail,
        message: "e-mail не соответствует формату",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "не передан пароль пользователя"],
      // minlength: 8,
      select: false,
    },
  },
  { versionKey: false }, // отключаем поле "__v"
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select("+password") // this — это модель User
    .then((user) => {
      // если такого юзера нет — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
      }
      // юзер есть — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
          }
          return user; // теперь юзер доступен
        });
    });
};

module.exports = mongoose.model("user", userSchema);
