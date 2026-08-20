const { UserRoles } = require("../../config/constant");
const brandService = require("./brand.service");

class BrandController {
  //Function to create Brand
  async create(req, res, next) {
    try {
      const data = await brandService.transformToBrandCreate(req);
      const brand = await brandService.save(data);
      res.json({
        data: brand,
        message: "Brand created successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //Functino to update Brand
  async update(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: req.params.brandId,
      };

      if (loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        };
      }

      const brand = await brandService.getSingleRowByFilter(filter);

      if (!brand) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        };
      }

      const data = await brandService.transformToBrandUpdate(req, brand);
      const update = await brandService.updateSingleRowByFilter(
        { _id: brand._id },
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

  //Function to list All Brand
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

      const { data, pagination } = await brandService.getAllRowsByFilter(
        filter,
        config,
      );

      res.json({
        data: data,
        message: "Brand Listing",
        status: "OK",
        meta: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  //Function to get detail of Brand
  async getDetail(req, res, next) {
    try {
      const brand = await brandService.getSingleRowByFilter({
        _id: req.params.brandId,
      });

      if (!brand) {
        throw {
          code: 401,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        };
      }

      res.json({
        data: brand,
        message: "Brand detail",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  //Function to delete Brand
  async delete(req, res, next) {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {
        _id: req.params.brandId,
      };

      if (loggedInUser.role !== UserRoles.ADMIN) {
        filter = {
          ...filter,
          createdBy: loggedInUser._id,
        };
      }

      const brand = await brandService.getSingleRowByFilter(filter);

      if (!brand) {
        throw {
          code: 404,
          message: "Brand not found",
          status: "BRAND_NOT_FOUND_ERR",
        };
      }

      const del = await brandService.deleteSinglerowByFilter(filter);

      res.json({
        data: del,
        message: "Brand Delted Successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailBySlug(req, res, next) {
    try {
      const brandDetail = await brandService.getSingleRowByFilter({
        slug: req.params.slug,
      });

      if (!brandDetail) {
        res.json({
          code: 404,
          message: "brand Not Found",
          status: "BRAND_NOT_FOUND_ERR",
        });
      }

      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const { data, pagination } = await productService.getAllRowsByFilter(
        {
          brand: brandDetail._id,
          status: Status.ACTIVE,
        },
        {
          page,
          limit,
        },
      );
      res.json({
        data: {
          category: brandDetail,
          products: data,
        },
        message: "Brand Detail",
        status: "ok",
        meta: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  }
}

let BrandCtrl = new BrandController();
module.exports = BrandCtrl;
