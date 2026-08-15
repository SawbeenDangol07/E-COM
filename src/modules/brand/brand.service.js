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

  async getSingleRowByFilter(filter) {
    try {
      const data = await BrandModel.findOne(filter)
        .populate("createdBy", [
          "_id",
          "name",
          "email",
          "role",
          "image",
          "status",
        ])
        .populate("updatedBy", [
          "_id",
          "name",
          "email",
          "role",
          "image",
          "status",
        ]);

      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async transformToBrandUpdate(req, brand) {
    try {
      const data = req.body;
      if (req.file) {
        data.logo = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/brand",
        );
      } else {
        data.logo = brand.logo;
      }
      data.updatedBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const update = await BrandModel.findOneAndUpdate(
        { $set: data },
        { new: true },
      );

      return update;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new BrandService();
