const bcrypt = require("bcryptjs");
const cloudinaryService = require("../../services/cloudinary.service");
const generateRandomString = require("../../utilities/randomStringGenerator");

class AuthService {
  async transformForUser(req) {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 12);
      if (req.file) {
        data.image = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/user",
        );
      }
      data.token = generateRandomString();
      data.expiryTime = new Date(Date.now() + 86400000);
      return data;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new AuthService();
