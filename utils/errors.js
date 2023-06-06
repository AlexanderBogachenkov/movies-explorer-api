const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICTING_REQUEST = 409;

const WRONG_EMAIL_OR_PASSWORD = "Неправильные почта или пароль";

const USER_NOT_FOUND_ERROR = "Пользователь по указанному _id не найден";
const USER_ID_IS_NOT_CORRECT = "Передан некорректный ID пользователя";
const USER_CREATION_DATA_IS_NOT_CORRECT = "Переданы некорректные данные при создании пользователя";
const USER_ALREADY_REGISTERED = "Такой пользователь уже зарегистрирован";
const USER_EDIT_PROFILE_DATA_IS_NOT_CORRECT = "Переданы некорректные данные при редактировании профиля пользователя";

const MOVIE_CREATION_DATA_IS_NOT_CORRECT = "Переданы некорректные данные при создании карточки фильма";
const MOVIE_IS_NOT_YOURS = "Вы пытаетесь удалить чужой фильм";
const MOVIE_ID_NOT_FOUND = "Фильм с таким идентификатором не найден";

const AUTHORIZATION_REQUIRED = "Необходима авторизация";
const WRONG_DATA_RECIEVIED = "Переданы неверные данные";

const PAGE_NOT_FOUND = "Страница по этому адресу не найдена";

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICTING_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  USER_NOT_FOUND_ERROR,
  USER_ID_IS_NOT_CORRECT,
  USER_CREATION_DATA_IS_NOT_CORRECT,
  USER_ALREADY_REGISTERED,
  USER_EDIT_PROFILE_DATA_IS_NOT_CORRECT,
  MOVIE_CREATION_DATA_IS_NOT_CORRECT,
  MOVIE_IS_NOT_YOURS,
  MOVIE_ID_NOT_FOUND,
  AUTHORIZATION_REQUIRED,
  WRONG_DATA_RECIEVIED,
  WRONG_EMAIL_OR_PASSWORD,
  PAGE_NOT_FOUND,
};
