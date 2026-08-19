const { Op } = require("sequelize");
const bannerService = require("./banner.service");

class BannerController {
  async createBanner(req, res, next) {
    try {
      const data = await bannerService.transformForCreate(req);
      const banner = await bannerService.store(data);

      res.json({
        data: banner,
        message: "Banner Created successfully",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async listAllBanners(req, res, next) {
    try {
      let filter = {};

      // search
      if (req.query.q) {
        filter = {
          // iLike query ''
          title: { [Op.iLike]: `%${req.query.q}%` },
        };
      }
      // status
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

      const { data, pagination } = await bannerService.getAllRowsByFilter(
        filter,
        config
      );

      res.json({
        data: data,
        message: "banner List",
        status: "OK",
        meta: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  }

  async getDetailById(req, res, next) {
    try {
      let filter = {
        _id: req.params.bannerId,
      };
      const data = await bannerService.getSingleRowByFilter(filter);
      res.json({
        data: data,
        message: "Banner Detail",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async updateBannerById(req, res, next) {
    try {
      let filter = {
        _id: req.params.bannerId,
      };
      const bannerDetail = await bannerService.getSingleRowByFilter(filter);
      if (!bannerDetail) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "BANNER_NOT_FOUND_ERR",
        };
      }
      let updateData = await bannerService.transformForUpdate(
        req,
        bannerDetail
      );
      updateData = await bannerService.updateSingleRowByFilter(
        filter,
        updateData
      );
      res.json({
        data: updateData,
        message: "Banner Detail",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async deleteById(req, res, next) {
    try {
      let filter = {
        _id: req.params.bannerId,
      };
      const bannerDetail = await bannerService.getSingleRowByFilter(filter);
      if (!bannerDetail) {
        throw {
          code: 404,
          message: "Banner not found",
          status: "BANNER_NOT_FOUND_ERR",
        };
      }
      const del = await bannerService.deleteSingleRowByFilter(filter);

      res.json({
        data: del,
        message: "Banner Deleted",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }
}

module.exports = new BannerController();
