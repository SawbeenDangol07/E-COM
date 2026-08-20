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

      data.createdBy = req.loggedInUser._id;
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
      if (data.name) {
        data.slug = slugify(data.name, {
          lower: true,
          trim: true,
          strict: true,
          remove: /[*+.()'"!:@]/g,
        });
      }
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
        filter,
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
      const data = await BrandModel.find(filter)
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

      const total = await BrandModel.countDocuments(filter);

      return { data, pagination: { page: page, limit: limit, total: total } };
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSinglerowByFilter(filter) {
    try {
      const del = await BrandModel.findOneAndDelete(filter);
      return del;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new BrandService();
