const mongoose = require("mongoose");
const isUrl = require("validator/lib/isURL");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, "не указана страна создания фильма"],
  },
  director: {
    type: String,
    required: [true, "не указан режиссёр фильма"],
  },
  duration: {
    type: Number,
    required: [true, "не указана длительность фильма"],
  },
  year: {
    type: String,
    required: [true, "не указан год выпуска фильма"],
  },
  description: {
    type: String,
    required: [true, "не указано описание фильма"],
  },
  image: {
    type: String,
    required: [true, "не указана ссылка на постер к фильму"],
    validate: {
      validator: (link) => isUrl(link, {
        protocols: ["http", "https"],
        require_protocol: true,
      }),
    },
    message: "ссылка не соответствует формату",
  },
  trailerLink: {
    type: String,
    required: [true, "не указана ссылка на трейлер фильма"],
    validate: {
      validator: (link) => isUrl(link, {
        protocols: ["http", "https"],
        require_protocol: true,
      }),
    },
    message: "ссылка не соответствует формату",
  },
  thumbnail: {
    type: String,
    required: [true, "не указано миниатюрное изображение постера к фильму"],
    validate: {
      validator: (link) => isUrl(link, {
        protocols: ["http", "https"],
        require_protocol: true,
      }),
    },
    message: "ссылка не соответствует формату",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "не указано _id пользователя, который сохранил фильм"],
  },
  movieId: {
    type: Number,
    required: [true, "не указано id фильма, который содержится в ответе сервиса"],
  },
  nameRU: {
    type: String,
    required: [true, "не указано название фильма на русском языке"],
  },
  nameEN: {
    type: String,
    required: [true, "не указано название фильма на английском языке"],
  },
});

module.exports = mongoose.model("movie", movieSchema);
