const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const schedule = require("node-schedule");

const AuthRoute = require("./routes/Auth");
const NotesRoute = require("./routes/Notes");
const deleteGuestUsers = require("./helpers/deleteGuestUsers");

const app = express();

app.use(morgan("dev"));

// подключаем cookie-parser middleware для работы с cookies
app.use(cookieParser());

// handle json/form req body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cors
app.use(
  cors({
    origin: "http://localhost:3006",
    credentials: true,
    methods: "GET, POST, DELETE, PUT",
  })
);

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello from express");
});

// ROUTES
app.use("/auth", AuthRoute);
app.use("/notes", NotesRoute);

// path not found error
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

// delete guest users job - runs every 2 hours
const job = schedule.scheduleJob("*/2 * * *", async () => {
  await deleteGuestUsers();
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
