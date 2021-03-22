const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/Notes");

const { verifyAccessToken } = require("../helpers/jwt_helper");

router.get("/pages", verifyAccessToken, NotesController.getPages);
router.get("/update-page", verifyAccessToken, NotesController.updatePage);
router.get("/add-page", verifyAccessToken, NotesController.addPage);
router.get("/page", verifyAccessToken, NotesController.getPage);

module.exports = router;
