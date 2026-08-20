const mongoose = require("mongoose");
const { UserRoles, Status } = require("../../config/constant");
const productService = require("./product.service");
const ProductService = require("./product.service");
const CategoryModel = require("../category/category.model");
const BrandModel = require("../brand/brand.model");

class productController {
  async createProduct(req, res, next) {
    try {
      const data = await ProductService.transformToProduct(req);
      const product = await ProductService.createProduct(data);
      res.json({
        data: product,
        message: "Product created successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getAllProduct(req, res, next) {
    try {
      let filter = {};
      if (req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          createdBy: req.loggedInUser._id,
        };
      }

      if (req.query.search) {
        filter = {
          ...filter,
          $or: [
            { name: new RegExp(req.query.search, "i") },
            { description: new RegExp(req.query.search, "i") },
          ],
        };
      }

      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 50;

      const { data, pagination } = await ProductService.getAllRowsByFilter(
        filter,
        {
          page: page,
          limit: limit,
        },
      );
      res.json({
        data: data,
        message: "Products fetched successfully",
        status: "OK",
        meta: pagination,
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      let filter = {
        slug: req.params.slug,
      };
      const product = await productService.getSingleRowByFilter(filter);

      if (!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        };
      }

      //related product
      const { data } = await productService.getAllRowsByFilter(
        {
          category: { $in: product.category.map((row) => row._id) },
          status: Status.ACTIVE,
        },
        { page: 1, limit: 8 },
      );

      res.json({
        data: { product, related: data },
        message: "Product fetched sucessfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getProductById(req, res, next) {
    try {
      let filter = {
        _id: req.params.id,
      };
      if (req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          createdBy: req.loggedInUser._id,
        };
      }

      const product = await productService.getSingleRowByFilter(filter);

      res.json({
        data: product,
        message: "Product fetched sucessfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async updateProductById(req, res, next) {
    try {
      let filter = {
        _id: req.params.id,
      };
      if (req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          createdBy: req.loggedInUser._id,
        };
      }
      const product = await productService.getSingleRowByFilter(filter);

      if (!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        };
      }

      const data = await productService.transformToProductForUpdate(
        req,
        product,
      );

      const response = await productService.updateProductByFilter(filter, data);
      res.json({
        data: response,
        message: "Product updated successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async deleteProductById(req, res, next) {
    try {
      let filter = {
        _id: req.params.id,
      };
      if (req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          createdBy: req.loggedInUser._id,
        };
      }
      const product = await productService.getSingleRowByFilter(filter);

      if (!product) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        };
      }

      //delete operation
      const response = await productService.deleteSingleProductByFilter(filter);
      res.json({
        data: response,
        message: "Product deleted successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getPublicProduct(req, res, next) {
    try {
      let filter = { status: Status.ACTIVE };

      // Text search
      if (req.query.search && req.query.search.trim()) {
        filter.$or = [
          { name: new RegExp(req.query.search.trim(), "i") },
          { description: new RegExp(req.query.search.trim(), "i") },
        ];
      }

      // Category filter (support ID or slug)
      if (req.query.category && req.query.category !== "all") {
        if (mongoose.Types.ObjectId.isValid(req.query.category)) {
          filter.category = {
            $in: [new mongoose.Types.ObjectId(req.query.category)],
          };
        } else {
          const categoryDoc = await CategoryModel.findOne({
            slug: req.query.category,
          });
          if (categoryDoc) {
            filter.category = { $in: [categoryDoc._id] };
          }
        }
      }

      // Brand filter (support ID, slug, or name)
      if (req.query.brand && req.query.brand !== "all") {
        if (mongoose.Types.ObjectId.isValid(req.query.brand)) {
          filter.brand = {
            $in: [new mongoose.Types.ObjectId(req.query.brand)],
          };
        } else {
          const brandDoc = await BrandModel.findOne({
            $or: [
              { slug: req.query.brand.toLowerCase() },
              { name: new RegExp(`^${req.query.brand}$`, "i") },
            ],
          });
          if (brandDoc) {
            filter.brand = { $in: [brandDoc._id] };
          }
        }
      }

      // Price range filter
      if (req.query.minPrice || req.query.maxPrice) {
        filter.afterDiscount = {};
        if (req.query.minPrice && !isNaN(+req.query.minPrice)) {
          filter.afterDiscount.$gte = +req.query.minPrice * 100;
        }
        if (req.query.maxPrice && !isNaN(+req.query.maxPrice)) {
          filter.afterDiscount.$lte = +req.query.maxPrice * 100;
        }
      }

      // Sorting
      let sort = { createdAt: "desc" };
      if (req.query.sortBy === "price-asc") {
        sort = { afterDiscount: "asc" };
      } else if (req.query.sortBy === "price-desc") {
        sort = { afterDiscount: "desc" };
      } else if (req.query.sortBy === "discount") {
        sort = { discount: "desc" };
      }

      const page = +req.query.page || 1;
      const limit = +req.query.limit || 100;

      const { data, pagination } = await ProductService.getAllRowsByFilter(
        filter,
        {
          page,
          limit,
          sort,
        },
      );

      res.json({
        data: data,
        message: "Products fetched successfully",
        status: "OK",
        meta: pagination,
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const productCtrl = new productController();
module.exports = productCtrl;
