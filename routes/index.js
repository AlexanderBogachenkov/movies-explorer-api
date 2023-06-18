const router = require("express").Router();
// const { celebrate, Joi } = require("celebrate");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { signupValidator, signinValidator } = require("../middlewares/validators");
const userRoute = require("./users");
const movieRoute = require("./movies");
const NotFoundError = require("../utils/NotFoundError");

// ИМПОРТ ОШИБОК
const {
  PAGE_NOT_FOUND,
} = require("../utils/errors");

// Роутеры без авторизации - SIGNUP and SIGNIN
router.post("/signup", signupValidator, createUser);
router.post("/signin", signinValidator, login);

// Роутеры с авторзацией
router.use("/users", auth, userRoute);
router.use("/movies", auth, movieRoute);
router.use("*", auth, () => {
  throw new NotFoundError(PAGE_NOT_FOUND);
});

module.exports = router;
