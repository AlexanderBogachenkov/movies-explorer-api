const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // импортируем bcrypt
const isEmail = require("validator/lib/isEmail");
// const isUrl = require("validator/lib/isURL");
const UnauthorizedError = require("../utils/UnauthorizedError");

// ИМПОРТ ОШИБОК
const {
  WRONG_EMAIL_OR_PASSWORD,

} = require("../utils/errors");

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
      select: false,
    },
  },
  { versionKey: false }, // отключаем поле "__v"
);

userSchema.statics.findUserByCredentials = function _(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select("+password") // this — это модель User
    .then((user) => {
      // если такого юзера нет — отклоняем промис
      if (!user) {
        return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
      }
      // юзер есть — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(WRONG_EMAIL_OR_PASSWORD));
          }
          return user; // теперь юзер доступен
        });
    });
};

module.exports = mongoose.model("user", userSchema);
