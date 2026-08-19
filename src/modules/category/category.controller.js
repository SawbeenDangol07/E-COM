const { UserRoles, Status } = require("../../config/constant");
const productService = require("../product/product.service");
const categoryService = require("./category.service");

class CategoryController {
  async addCategory(req, res, next) {
    try {
      const data = await categoryService.transformToCategoryData(req);
      const category = await categoryService.storeCategory(data);
      res.json({
        data: category,
        message: "Category Created successfully",
        status: "CATEGORY_CREATED",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      let filter = {};
      if (req.loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: req.loggedInUser._id,
        };
      }
      const data = await categoryService.listAllCategoriesByFilter(filter);
      res.json({
        data: data,
        message: "Category Listing ",
        status: "CATEGORY_LIST",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getAllActiveCategories(req, res, next) {
    try {
      let filter = { status: Status.ACTIVE };
      const data = await categoryService.listAllCategoriesByFilter(filter);
      res.json({
        data: data,
        message: "Category Listing ",
        status: "CATEGORY_LIST",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const categoryDetail = await categoryService.validateCategoryDetail(
        req.params.id,
        req.loggedInUser,
      );
      res.json({
        data: categoryDetail,
        message: "Category Detail",
        status: "CATEGORY_DETAIL",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async updateCategoryData(req, res, next) {
    try {
      const categoryDetail = await categoryService.validateCategoryDetail(
        req.params.id,
        req.loggedInUser,
      );
      let updateData = await categoryService.transformToCategoryUpdateData(
        req,
        categoryDetail,
      );
      updateData = await categoryService.updateCategory(updateData, {
        _id: categoryDetail._id,
      });
      res.json({
        data: updateData,
        message: "Category Updated ",
        status: "CATEGORY_UPDATED",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async deleteCategoryById(req, res, next) {
    try {
      const categoryDetail = await categoryService.validateCategoryDetail(
        req.params.id,
        req.loggedInUser,
      );
      const del = await categoryService.deleteDataByFilter({
        _id: categoryDetail._id,
      });
      res.json({
        data: del,
        message: "Category deleted ",
        status: "CATEGORY_DELETED",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailsBySlug(req, res, next) {
    try {
      const categoryDetail = await categoryService.getSingleRowByFilter({
        slug: req.params.slug,
      });

      if (!categoryDetail) {
        res.json({
          code: 404,
          message: "Categoty Not Found",
          status: "CATEGORY_NOT_FOUND_ERR",
        });
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const { data, pagination } = await productService.getAllRowsByFilter(
        {
          category: { $in: [categoryDetail._id] },
          status: Status.ACTIVE,
        },
        {
          page,
          limit,
        },
      );
      res.json({
        data: {
          category: categoryDetail,
          products: data,
        },
        message: "Category Detail",
        status: "ok",
        meta: pagination,
      });
    } catch (exception) {
      next(exception);
    }
  }
}

const categoryCtrl = new CategoryController();
module.exports = categoryCtrl;
