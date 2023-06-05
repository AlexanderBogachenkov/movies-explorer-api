const router = require("express").Router();
// const { celebrate, Joi } = require("celebrate");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { signupValidator, signinValidator } = require("../middlewares/validators");
const userRoute = require("./users");
const movieRoute = require("./movies");
const NotFoundError = require("../utils/NotFoundError");

// Роутеры без авторизации - SIGNUP and SIGNIN
router.post("/signin", signupValidator, login);
router.post("/signup", signinValidator, createUser);

// Роутеры с авторзацией
router.use("/users", auth, userRoute);
router.use("/movies", auth, movieRoute);
router.use("*", auth, () => {
  throw new NotFoundError("Страница  по этому адресу не найдена");
});

module.exports = router;
