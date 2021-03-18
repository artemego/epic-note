const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/Notes");

const { verifyAccessToken } = require("../helpers/jwt_helper");

router.get("/pages", verifyAccessToken, NotesController.pages);

module.exports = router;
