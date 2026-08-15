const slugify = require("slugify");
const cloudinaryService = require("../../services/cloudinary.service");
const BrandModel = require("./brand.model");

class BrandService {
  async transformToBrandCreate(req) {
    try {
      const data = req.body;
      data.slug = slugify(data.name, {
        lower: true,
        trim: true,
        strict: true,
        remove: /[*+.()'"!:@]/g,
      });
      if (req.file) {
        data.logo = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/brand",
        );
      }

      data.createBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async save(data) {
    try {
      const brand = new BrandModel(data);
      return await brand.save();
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new BrandService();
