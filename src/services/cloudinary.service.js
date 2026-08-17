const { CloudinaryConfig } = require("../config/app.config");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.className,
      api_key: CloudinaryConfig.apiKey,
      api_secret: CloudinaryConfig.apiSecrete,
    });
  }

  async singlefileUpload(filepath, dir = "/") {
    try {
      const response = await cloudinary.uploader.upload(filepath, {
        folder: "api-55" + dir,
      });
      fs.unlinkSync(filepath);
      return {
        public_id: response.public_id,
        url: response.secure_url,
      };
    } catch (exception) {
      throw {
        code: 500,
        message: "Cloudinary file upload failed",
        status: "CLOUDINARY_FILE_UPLOAD_ERR",
        detail: exception.message || null,
      };
    }
  }
}

module.exports = new CloudinaryService();
