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
}

module.exports = new userService();
