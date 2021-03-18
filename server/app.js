const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");
const { verifyAccessToken } = require("./helpers/jwt_helper");

const AuthRoute = require("./routes/Auth");
const NotesRoute = require("./routes/Notes");

const app = express();

app.use(morgan("dev"));

// подключаем cookie-parser middleware для работы с cookies
app.use(cookieParser());

// handle json/form req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cors
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  console.log(req.headers["authorization"]);
  res.send("Hello from express");
});

// ROUTES
app.use("/auth", AuthRoute);
app.use("/notes", NotesRoute);

// path not found error
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

// обработка ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
