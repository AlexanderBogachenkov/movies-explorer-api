const router = require("express").Router();
const {
  getMe, updateProfile,
} = require("../controllers/users");

const {
  userDataValidator,
} = require("../middlewares/validators");

// # возвращает информацию о пользователе (email и имя)
router.get("/me", getMe);

// # обновляет информацию о пользователе (email и имя)
router.patch("/me", userDataValidator, updateProfile);

module.exports = router;
