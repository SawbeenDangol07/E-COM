const { UserRoles, Status } = require("../../config/constant");
const productService = require("./product.service");
const ProductService = require("./product.service");
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
          name: new RegExp(req.query.search, "i"),
          description: new RegExp(req.query.search, "i"),
        };
      }

      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 2;

      const { data, pagination } = await ProductService.getAllRowsByFilter(
        filter,
        {
          page: page,
          limit: limit,
        }
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
        { page: 1, limit: 8 }
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

      const updateData = await productService.transformToProductForUpdate(
        req,
        product
      );

      const response = await productService.updateProductByFilter(
        { _id: product._id },
        updateData
      );

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
          ...filter,
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

      if (req.query.search) {
        filter = {
          ...filter,
          name: new RegExp(req.query.search, "i"),
          description: new RegExp(req.query.search, "i"),
        };
      }

      // if (req.query.category) {
      //   filter = {
      //     ...filter,
      //     category: { $in: [req.query.category] },
      //   };
      // }

      const page = req.query.page || 1;
      const limit = req.query.limit || 2;

      const { data, pagination } = await ProductService.getAllRowsByFilter(
        filter,
        {
          page: page,
          limit: limit,
        }
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
