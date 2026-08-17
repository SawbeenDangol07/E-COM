const slugify = require("slugify");
const cloudinaryService = require("../../services/cloudinary.service");
const CategoryModel = require("./category.model");

class CategoryService {
  async transformToCategoryCreate(req) {
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
          "/Category",
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
      const Category = new CategoryModel(data);
      return await Category.save();
    } catch (exception) {
      throw exception;
    }
  }

  async getSingleRowByFilter(filter) {
    try {
      const data = await CategoryModel.findOne(filter)
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

  async transformToCategoryUpdate(req, Category) {
    try {
      const data = req.body;
      if (req.file) {
        data.logo = await cloudinaryService.singlefileUpload(
          req.file.path,
          "/Category",
        );
      } else {
        data.logo = Category.logo;
      }
      data.updatedBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const update = await CategoryModel.findOneAndUpdate(
        { $set: data },
        { new: true },
      );

      return update;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, config = { page: 1, limit: 20 }) {
    try {
      const page = config.page || 1;
      const limit = config.limit || 20;
      const skip = (page - 1) * limit;
      const data = await CategoryModel.find(filter)
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
        ])
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit);

      const total = await CategoryModel.countDocuments(filter);

      return { data, pagination: { page: page, limit: limit, total: total } };
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSinglerowByFilter(filter) {
    try {
      const del = await CategoryModel.findOneAndDelete(filter);
      return del;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new CategoryService();
