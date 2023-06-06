// Ошибки из mongoose.Error
const { ValidationError } = require("mongoose").Error;

// Ошибки из конструктора ошибок
const NotFoundError = require("../utils/NotFoundError");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");

const Movie = require("../models/movie");
const { CREATED_CODE } = require("../utils/constants");

// ИМПОРТ ОШИБОК
const {
  MOVIE_CREATION_DATA_IS_NOT_CORRECT,
  MOVIE_IS_NOT_YOURS,
  MOVIE_ID_NOT_FOUND,

} = require("../utils/errors");

// Создаем фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => movie.populate("owner"))
    .then((movie) => res.status(CREATED_CODE).send(movie))
    .catch((error) => {
      if (error instanceof ValidationError) {
        const errorMessage = Object.values(error.errors)
          .map((err) => err.message)
          .join(", ");
        next(new BadRequestError(`${MOVIE_CREATION_DATA_IS_NOT_CORRECT} ${errorMessage}`));
      } else {
        next(error);
      }
    });
};

// Получаем фильмы сохраненные пользователем
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(["owner"])
    .then((movies) => res.send(movies))
    .catch(() => {
      next();
    });
};

// Функция удаляет фильм по идентификатору
const deleteMovieById = (req, res, next) => {
  // Найдем фильм по id
  Movie.findById(req.params._id).then((movie) => {
    // Если есть такой фильм
    if (movie) {
      const ownerId = movie.owner.toString();
      const userId = req.user._id;
      // Проверим владелиц ли фильма
      if (ownerId === userId) {
        // Найдем и удалим
        Movie.findByIdAndRemove(req.params._id)
          .then((deleted) => {
            res.status(200).send(deleted);
          })
          .catch(() => {
            next();
          });
      } else {
        next(new ForbiddenError(MOVIE_IS_NOT_YOURS));
      }
    } else {
      next(new NotFoundError(MOVIE_ID_NOT_FOUND));
    }
  })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError(MOVIE_ID_NOT_FOUND));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createMovie,
  deleteMovieById,
  getMovies,
};
