const chatRouter = require("express").Router();
const checkLogin = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validation.middleware");
const chatController = require("./chat.controller");
const { SendChatDTO } = require("./chat.validator");

chatRouter.get("/list-users", checkLogin(), chatController.listAllUsers);

chatRouter.post(
  "/send-message",
  checkLogin(),
  bodyValidator(SendChatDTO),
  chatController.sendMessage,
);

chatRouter.get("/detail/:userId", checkLogin(), chatController.getChatDetail);

chatRouter.delete("/message/:chatId", checkLogin(), chatController.deleteMessage);

chatRouter.delete("/conversation/:userId", checkLogin(), chatController.clearConversation);

module.exports = chatRouter;
