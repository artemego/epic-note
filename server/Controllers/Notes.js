const createHttpError = require("http-errors");
const User = require("../models/User");
const Page = require("../models/Page");

module.exports = {
  getPages: async (req, res, next) => {
    try {
      // Получаем userId из req
      const userId = req.payload.aud;
      // console.log(req.payload.aud);
      // Ищем пользователя в базе данных
      const user = await User.findById(userId);
      if (!user) {
        console.log("in not found");
        throw createHttpError.NotFound("Cannot find user by id");
      }
      // get pages
      res.status(200).json({
        message: "Fetched pages successfully.",
        pages: user.pages,
      });
    } catch (err) {
      next(err);
    }
  },
  getPage: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const pageId = req.params.pageId;
      // console.log(JSON.stringify(req.query));
      console.log("in get page");
      console.log("pageId" + pageId);

      // console.log("params: " + JSON.stringify(req.params));
      // console.log("page id" + pageId);
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
      let pageName = req.body.name;
      console.log(req.body);
      console.log(pageName);

      // Если имя пустое, то имя страницы Untitled
      if (!pageName) pageName = "Untitled";

      const page = new Page({
        blocks: blocks,
        creator: userId,
        name: pageName,
      });

      const savedPage = await page.save();

      // Обновляем коллекцию пользователей
      const user = await User.findById(userId);
      if (!user) {
        throw createHttpError.NotFound("Cannot find user by id");
      }
      // Добавляем вместе с page_id page name
      user.pages.push({ pageId: savedPage._id, name: pageName });

      await user.save();

      res.status(201).json({
        message: "Created page successfully.",
        pageId: savedPage._id.toString(),
        name: pageName,
        blocks: blocks,
        creator: userId,
      });
    } catch (err) {
      next(err);
    }
  },
  deletePage: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const pageId = req.params.pageId;

      const page = await Page.findById(pageId);
      if (!page) {
        throw createHttpError.NotFound("Cannot find page by id");
      }

      const creatorId = page.creator.toString();
      if (creatorId && creatorId === userId) {
        const deletedPage = await Page.findByIdAndDelete(pageId);

        // Обновляем коллекцию пользователей
        if (creatorId) {
          debugger;
          const user = await User.findById(userId);
          if (!user) {
            const err = new Error("Could not find user by id.");
            err.statusCode = 404;
            throw err;
          }

          const deleteIndex = user.pages.findIndex((p) => {
            return JSON.stringify(p.pageId) === JSON.stringify(deletedPage._id);
          });

          user.pages.splice(deleteIndex, 1);

          await user.save();
        }
        res.status(200).json({
          message: "Deleted page successfully.",
        });
      } else {
        throw createHttpError.Unauthorized("User is not authenticated");
      }
    } catch (err) {
      next(err);
    }
  },
};
