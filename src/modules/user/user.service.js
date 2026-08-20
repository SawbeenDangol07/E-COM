const UserModel = require("./user.model");

class userService {
  async storeUser(data) {
    try {
      const user = new UserModel(data);
      return await user.save();
    } catch (exception) {
      throw exception;
    }
  }

  async getSingleUserByFilter(filter) {
    try {
      const user = await UserModel.findOne(filter);
      return user;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, config = { page: 1, limit: 20 }) {
    try {
      const skip = (config.page - 1) * config.limit;
      const data = await UserModel.find(filter)
        .sort({ name: "asc" })
        .limit(config.limit)
        .skip(skip);
      const total = await UserModel.countDocuments(filter);
      return {
        data: data.map((user) => this.getPublicProfileOfUser(user)),
        pagination: {
          page: +config.page,
          limit: +config.limit,
          total: +total,
          totalNoOfPages: Math.ceil(total / config.limit),
        },
      };
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const update = await UserModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true },
      );
      return update;
    } catch (exception) {
      throw exception;
    }
  }

  getPublicProfileOfUser(user) {
    if (!user) return null;
    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userObj;
  }
}

module.exports = new userService();
