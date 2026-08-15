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
      next(expcetion);
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

  //Function to list Brand
  async listAll(req, res, next) {
    try {
    } catch (expcetion) {
      next(exception);
    }
  }
}

let BrandCtrl = new BrandController();
module.exports = BrandCtrl;
