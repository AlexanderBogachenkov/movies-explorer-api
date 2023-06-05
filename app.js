require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const errorsHandler = require("./middlewares/errors");
const indexRoutes = require("./routes/index");

const app = express();

const { PORT = 3000, DATABASE } = process.env;
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
});

const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(helmet());
app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // подключаем CORS

app.use(requestLogger); // подключаем логгер запросов

app.use("/", indexRoutes); // подключаем роуты

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
