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
      // console.log("in get page");
      // console.log("pageId" + pageId);

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
  // это мы вызываем, когда изменяется порядок страниц в дереве.
  updatePages: async (req, res, next) => {
    // Todo: сюда приходит объект дерева от клиента, из него достаем items
    try {
      const { items } = req.body;
      const userId = req.payload.aud;
      const user = await User.findById(userId);

      if (!user) {
        throw createHttpError.NotFound("Cannot find user by id");
      }

      user.pages.rootIds = items["1"].children;
      const pageItems = Object.values(items);
      // удаляем root элемент
      pageItems.shift();
      user.pages.pageItems = pageItems;
      user.save();
      res.status(200).json({
        message: "Updated page successfully.",
        pages: user.pages.pageItems,
      });
    } catch (err) {
      next(err);
    }
  },
  addPage: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const blocks = req.body.blocks;
      let pageName = req.body.name;

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

      user.pages.pageItems.push({
        id: savedPage._id.toString(),
        children: [],
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          title: pageName,
        },
      });
      // добавляем id страницы в массив children у root
      user.pages.rootIds.push(savedPage._id.toString());

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
          const user = await User.findById(userId);
          if (!user) {
            const err = new Error("Could not find user by id.");
            err.statusCode = 404;
            throw err;
          }
          const deletedPageId = JSON.stringify(deletedPage._id);
          const deleteIndex = user.pages.pageItems.findIndex((p) => {
            return JSON.stringify(p.id) === deletedPageId;
          });
          user.pages.pageItems.splice(deleteIndex, 1);

          user.pages.pageItems.forEach((p) => {
            if (p.hasChildren) {
              const index = p.children.findIndex((child) => {
                return JSON.stringify(child) === deletedPageId;
              });

              if (index !== -1) {
                p.children.splice(index, 1);
              }
              // console.log("after deleting children " + p.children);
            }
          });
          // console.log("pages after deletion: " + user.pages.pageItems);

          // console.log("previous root ids: " + user.pages.rootIds);
          const newRootIds = user.pages.rootIds.filter((id) => {
            return JSON.stringify(id) !== deletedPageId;
          });
          user.pages.rootIds = newRootIds;
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
