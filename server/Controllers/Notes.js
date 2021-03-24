const createHttpError = require("http-errors");
const User = require("../models/User");
const Page = require("../models/Page");

// Todo: может быть здесь стоит тоже проверять на существование пользователя (хотя уже была проверка в middleware)

module.exports = {
  getPages: async (req, res, next) => {
    try {
      // Получаем userId из req
      const userId = req.payload.aud;
      console.log(req.payload.aud);
      // Ищем пользователя в базе данных
      const user = await User.findById(userId);
      if (!user) {
        throw createHttpError.NotFound("Cannot find user by id");
      }
      // get pages
      res.status(200).json({
        message: "Fetched pages successfully.",
        pages: user.pages.map((page) => page.toString()),
      });
    } catch (err) {
      next(err);
    }
  },
  getPage: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const pageId = req.params.pageId;

      console.log("params: " + JSON.stringify(req.params));
      console.log("page id" + pageId);
      const page = await Page.findById(pageId);
      if (!page) {
        throw createHttpError.NotFound("Cannot find page by id");
      }
      // проверяем, совпадает ли creatorId с userId из запроса
      const creatorId = page.creator.toString();
      if (creatorId && creatorId === userId) {
        res.status(200).json({
          message: "Fetched page successfully.",
          page: page,
        });
      } else {
        throw createHttpError.Unauthorized("User is not authenticated");
      }
    } catch (err) {
      next(err);
    }
  },
  updatePage: async (req, res, next) => {
    try {
      const blocks = req.body.blocks;
      const userId = req.payload.aud;
      const pageId = req.params.pageId;

      const page = await Page.findById(pageId);

      if (!page) {
        throw createHttpError.NotFound("Cannot find page by id");
      }

      const creatorId = page.creator.toString();
      if (creatorId && creatorId === userId) {
        page.blocks = blocks;
        const savedPage = await page.save();
        res.status(200).json({
          message: "Updated page successfully.",
          page: savedPage,
        });
      } else {
        throw createHttpError.Unauthorized("User is not authenticated");
      }
    } catch (err) {
      next(err);
    }
  },
  addPage: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const blocks = req.body.blocks;
      const page = new Page({
        blocks: blocks,
        creator: userId,
      });

      const savedPage = await page.save();

      // Обновляем коллекцию пользователей
      const user = await User.findById(userId);
      if (!user) {
        throw createHttpError.NotFound("Cannot find user by id");
      }
      user.pages.push(savedPage._id);
      await user.save();

      res.status(201).json({
        message: "Created page successfully.",
        pageId: savedPage._id.toString(),
        blocks: blocks,
        creator: userId,
      });
    } catch (err) {
      next(err);
    }
  },

  // Todo: add delete page function.
};
