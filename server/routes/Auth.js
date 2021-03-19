const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/Auth");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

module.exports = router;
