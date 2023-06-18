const router = require("express").Router();
const { movieValidator, movieIdValidator } = require("../middlewares/validators");

const {
  getMovies, createMovie, deleteMovieById,
} = require("../controllers/movies");

// # возвращает все сохранённые текущим  пользователем фильмы
router.get("/", getMovies);

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description, image, trailer,
// nameRU, nameEN и thumbnail, movieId
router.post("/", movieValidator, createMovie);

// # удаляет сохранённый фильм по id
router.delete("/:_id", movieIdValidator, deleteMovieById);

module.exports = router;
