const cloudinaryService = require("../../services/cloudinary.service");
const BannerModel = require("./banner.model");

class BannerService {
  async transformForCreate(req) {
    const data = req.body;
    data.createdBy = JSON.stringify(req.loggedInUser._id);
    if (!req.file) {
      throw {
        code: 400,
        message: "Validation failed",
        detail: { image: "Image missing" },
        status: "VALIDATION_ERR",
      };
    }
    data.image = await cloudinaryService.singleFileUpload(
      req.file.path,
      "/banner"
    );

    return data;
  }

  async transformForUpdate(req, banner) {
    const data = req.body;
    data.updatedBy = JSON.stringify(req.loggedInUser._id);

    if (req.file) {
      data.image = await cloudinaryService.singleFileUpload(
        req.file.path,
        "/banner"
      );
    } else {
      data.image = banner.image;
    }

    return data;
  }

  async store(data) {
    try {
      // INSERT QUERY
      // INSERT INTO table
      const banner = await BannerModel.create(data);
      return banner;
    } catch (exception) {
      throw exception;
    }
  }

  async getSingleRowByFilter(filter) {
    try {
      const data = await BannerModel.findOne({
        where: filter,
      });
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, { page, limit }) {
    try {
      const skip = (page - 1) * limit;
      const { rows, count } = await BannerModel.findAndCountAll({
        where: filter,
        order: [["createdAt", "desc"]],
        limit: limit,
        offset: skip,
      });

      return {
        data: rows,
        pagination: {
          total: +count,
          page: +page,
          limit: +limit,
          totalNoOfpages: Math.ceil(count / limit),
        },
      };
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const [affectedCount, affectedRows] = await BannerModel.update(data, {
        where: filter,
        returning: [
          "_id",
          "title",
          "url",
          "image",
          "status",
          "createdBy",
          "updatedBy",
          "createdAt",
          "updatedAt",
        ],
      });
      return affectedRows[0];
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSingleRowByFilter(filter) {
    try {
      const del = await BannerModel.destroy({ where: filter });
      return del;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new BannerService();
