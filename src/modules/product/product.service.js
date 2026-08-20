const slugify = require("slugify");
const cloudinaryService = require("../../services/cloudinary.service");
const ProductModel = require("./product.model");

class ProductService {
  async transformToProduct(req, res) {
    try {
      const data = req.body;
      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
        replace: /[*+~.()'"!:@]/g,
      });

      data.price = data.price * 100;
      data.afterDiscount = data.price - (data.price * data.discount) / 100;

      if (!data.category || data.category === "null") {
        data.category = null;
      }
      if (!data.brand || data.brand === "null") {
        data.brand = null;
      }
      if (!data.seller || data.seller === "null") {
        data.seller = req.loggedInUser._id;
      }

      data.createdBy = req.loggedInUser._id;

      if (req.files) {
        let images = [];
        req.files.forEach((image) => {
          images.push(
            cloudinaryService.singlefileUpload(image.path, "/products"),
          );
        });

        const result = await Promise.allSettled(images);
        data.images = [];
        result.forEach((res) => {
          if (res.status === "fulfilled") {
            data.images.push(res.value);
          }
        });
      }
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async createProduct(data) {
    try {
      const product = new ProductModel(data);
      return await product.save();
    } catch (exception) {
      throw exception;
    }
  }

  async updateProductByFilter(filter, data) {
    try {
      const update = await ProductModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true },
      );
      return update;
    } catch (exception) {
      throw exception;
    }
  }

  async deleteSingleProductByFilter(filter) {
    try {
      const del = await ProductModel.findOneAndDelete(filter);
      return del;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllRowsByFilter(filter, config = { page: 1, limit: 100 }) {
    try {
      const page = +config.page || 1;
      const limit = +config.limit || 100;
      const skip = (page - 1) * limit;
      const sort = config.sort || { createdAt: "desc" };

      const data = await ProductModel.find(filter)
        .populate("category", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("brand", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("seller", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("createdBy", [
          "_id",
          "name",
          "role",
          "image",
          "status",
          "email",
        ])
        .populate("updatedBy", [
          "_id",
          "name",
          "role",
          "image",
          "status",
          "email",
        ])
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const count = await ProductModel.countDocuments(filter);
      return {
        data,
        pagination: {
          page: page,
          limit: limit,
          total: count,
          totalNoOfPages: Math.ceil(count / limit),
        },
      };
    } catch (exception) {
      throw exception;
    }
  }

  async getSingleRowByFilter(filter) {
    try {
      const data = await ProductModel.findOne(filter)
        .populate("category", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("brand", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("seller", [
          "_id",
          "name",
          "slug",
          "image",
          "parent",
          "brands",
          "status",
        ])
        .populate("createdBy", [
          "_id",
          "name",
          "role",
          "image",
          "status",
          "email",
        ])
        .populate("updatedBy", [
          "_id",
          "name",
          "role",
          "image",
          "status",
          "email",
        ]);

      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async transformToProductForUpdate(req, product) {
    try {
      const data = req.body;

      if (data.name) {
        data.slug = slugify(data.name, {
          lower: true,
          strict: true,
          trim: true,
          replace: /[*+~.()'"!:@]/g,
        });
      }

      if (data.price !== undefined) {
        data.price = data.price * 100;
        const discount =
          data.discount !== undefined ? data.discount : product.discount || 0;
        data.afterDiscount = data.price - (data.price * discount) / 100;
      } else if (data.discount !== undefined) {
        data.afterDiscount =
          product.price - (product.price * data.discount) / 100;
      }

      if (!data.category || data.category === "null") {
        data.category = null;
      }
      if (!data.brand || data.brand === "null") {
        data.brand = null;
      }
      if (!data.seller || data.seller === "null") {
        data.seller = req.loggedInUser._id;
      }

      data.updatedBy = req.loggedInUser._id;
      data.images = product.images;

      if (req.files) {
        let images = [];
        req.files.forEach((image) => {
          images.push(
            cloudinaryService.singlefileUpload(image.path, "/products"),
          );
        });

        const result = await Promise.allSettled(images);
        result.forEach((res) => {
          if (res.status === "fulfilled") {
            data.images.push(res.value);
          }
        });
      }
      return data;
    } catch (exception) {
      throw exception;
    }
  }
}

module.exports = new ProductService();
