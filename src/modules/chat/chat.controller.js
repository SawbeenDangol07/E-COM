const userService = require("../user/user.service");
const ChatModel = require("./chat.model");

class ChatController {
  async listAllUsers(req, res, next) {
    try {
      let filter = {
        _id: { $ne: req.loggedInUser._id },
      };
      if (req.query.q) {
        filter = {
          _id: { $ne: req.loggedInUser._id },
          $or: [
            { name: new RegExp(req.query.q, "i") },
            { email: new RegExp(req.query.q, "i") },
            { phone: new RegExp(req.query.q, "i") },
          ],
        };
      }
      let config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      };
      const { data, pagination } = await userService.getAllRowsByFilter(
        filter,
        config,
      );
      res.json({
        data: data,
        message: "User List",
        meta: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const data = req.body;
      data.sender = req.loggedInUser._id;

      const chat = new ChatModel(data);
      await chat.save();

      res.json({
        data: chat,
        message: "Chat message Send",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getChatDetail(req, res, next) {
    try {
      const userId = req.params.userId;
      const loggedInUser = req.loggedInUser;

      let filter = {
        $or: [
          { sender: loggedInUser._id, receiver: userId },
          { sender: userId, receiver: loggedInUser._id },
        ],
      };

      if (req.query.q) {
        filter = {
          ...filter,
          message: new RegExp(req.query.q, "i"),
        };
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 100,
      };

      let skip = (config.page - 1) * config.limit;

      const data = await ChatModel.find(filter)
        .populate("sender", [
          "_id",
          "name",
          "email",
          "role",
          "image",
          "gender",
          "status",
        ])
        .populate("receiver", [
          "_id",
          "name",
          "email",
          "role",
          "image",
          "gender",
          "status",
        ])
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(config.limit);
      const total = await ChatModel.countDocuments(filter);

      res.json({
        data: data,
        message: "Your chat Detail",
        status: "OK",
        meta: {
          pagination: {
            page: config.page,
            limit: config.limit,
            total: total,
            totalNoOfPages: Math.ceil(total / config.limit),
          },
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  // Delete a single message
  async deleteMessage(req, res, next) {
    try {
      const chatId = req.params.chatId;
      const loggedInUserId = req.loggedInUser._id;
      const isAdmin = req.loggedInUser.role === "admin";

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        throw {
          code: 404,
          message: "Message not found",
          status: "NOT_FOUND",
        };
      }

      if (!isAdmin && chat.sender.toString() !== loggedInUserId.toString()) {
        throw {
          code: 403,
          message: "You can only delete your own messages",
          status: "UNAUTHORIZED",
        };
      }

      await ChatModel.findByIdAndDelete(chatId);

      res.json({
        data: { _id: chatId },
        message: "Message deleted successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  // Clear full conversation thread with a user
  async clearConversation(req, res, next) {
    try {
      const targetUserId = req.params.userId;
      const loggedInUserId = req.loggedInUser._id;

      const result = await ChatModel.deleteMany({
        $or: [
          { sender: loggedInUserId, receiver: targetUserId },
          { sender: targetUserId, receiver: loggedInUserId },
        ],
      });

      res.json({
        data: { deletedCount: result.deletedCount },
        message: "Conversation cleared successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }
}

module.exports = new ChatController();
