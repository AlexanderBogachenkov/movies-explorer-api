const CREATED_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

const REGEX_URL = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

const REGEX_NAME_RU = /^[а-яА-ЯёЁ\d\s]+$/mi;
const REGEX_NAME_EN = /^[\w\s]+$/mi;

const {
  NODE_ENV,
  PORT = 3000,
  DATABASE,
  JWT_SECRET,
} = process.env;
const JWT_SECRET_DEV = "some-secret-dev-key";

const DATABASE_DEV = "mongodb://127.0.0.1:27017/bitfilmsdb";

module.exports = {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  REGEX_URL,
  REGEX_NAME_RU,
  REGEX_NAME_EN,
  NODE_ENV,
  PORT,
  DATABASE,
  DATABASE_DEV,
  JWT_SECRET,
  JWT_SECRET_DEV,
};
