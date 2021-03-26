const express = require("express");
const router = express.Router();
const NotesController = require("../Controllers/Notes");

const { verifyAccessToken } = require("../helpers/jwt_helper");

// get pages
router.get("/", verifyAccessToken, NotesController.getPages);

// get single page with pageId
router.get("/:pageId", verifyAccessToken, NotesController.getPage);

router.put("/:pageId", verifyAccessToken, NotesController.updatePage);

router.post("/", verifyAccessToken, NotesController.addPage);

module.exports = router;
