const { UserRoles } = require("../../config/constant");
const CategoryService = require("./category.service");

class CategoryController {
  //Function to create Category
  async create(req, res, next) {
    try {
      const data = await CategoryService.transformToCategoryCreate(req);
      const Category = await CategoryService.save(data);
      res.json({
        data: Category,
        message: "Category created successfully",
        status: "OK",
      });
    } catch (exception) {
      next(expcetion);
    }
  }

  //Functino to update Category
  async update(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: req.params.CategoryId,
      };

      if (loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        };
      }

      const Category = await CategoryService.getSingleRowByFilter(filter);

      if (!Category) {
        throw {
          code: 404,
          message: "Category not found",
          status: "Category_NOT_FOUND_ERR",
        };
      }

      const data = await CategoryService.transformToCategoryUpdate(
        req,
        Category,
      );
      const update = await CategoryService.updateSingleRowByFilter(
        { _id: Category._id },
        data,
      );

      res.json({
        data: update,
        message: "Updated successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //Function to list All Category
  async listAll(req, res, next) {
    try {
      let filter = {};
      if (req.query.search) {
        filter = {
          $or: [{ name: new RegExp(req.query.search, "i") }],
        };
      }

      if (req.query.status) {
        filter = {
          ...filter,
          status: req.query.status,
        };
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      };

      const { data, pagination } = await CategoryService.getAllRowsByFilter(
        filter,
        config,
      );

      res.json({
        data: data,
        message: "Category Listing",
        status: "OK",
        meta: {
          pagination,
        },
      });
    } catch (expcetion) {
      next(exception);
    }
  }

  //Function to get detail of Category
  async getDetail(req, res, next) {
    try {
      const Category = await CategoryService.getSingleRowByFilter({
        _id: req.params.CategoryId,
      });

      if (!Category) {
        throw {
          code: 401,
          message: "Category not found",
          status: "Category_NOT_FOUND_ERR",
        };
      }

      res.json({
        data: Category,
        message: "Category detail",
        status: "OK",
      });
    } catch (expcetion) {
      next(exception);
    }
  }

  //Function to delete Category
  async delete(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: req.params.CategoryId,
      };

      if (loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        };
      }

      const Category = await CategoryService.getSingleRowByFilter(filter);

      if (!Category) {
        throw {
          code: 404,
          message: "Category not found",
          status: "Category_NOT_FOUND_ERR",
        };
      }

      const del = await CategoryService.deleteSinglerowByFilter(filter);

      res.json({
        data: del,
        message: "Category Delted Successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailBySlug(req, res, next) {
    try {
      const CategoryDetail = await CategoryService.getSingleRowByFilter({
        slug: req.params.slug,
      });

      if (!CategoryDetail) {
        res.json({
          code: 404,
          message: "Category Not Found",
          status: "Category_NOT_FOUND_ERR",
        });
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const { data, pagination } = await productService.getAllRowsByFilter(
        {
          Category: CategoryDetail._id,
          status: Status.ACTIVE,
        },
        {
          page,
          limit,
        },
      );
      res.json({
        data: {
          category: CategoryDetail,
          products: data,
        },
        message: "Category Detail",
        status: "ok",
        meta: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  }
}

let CategoryCtrl = new CategoryController();
module.exports = CategoryCtrl;
