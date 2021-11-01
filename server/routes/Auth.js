const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/Auth");

const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

router.get("/info", verifyAccessToken, AuthController.info);

module.exports = router;
