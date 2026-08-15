const brandService = require("./brand.service");

class BrandController {
  async create() {
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
}

let BrandCtrl = new BrandController();
module.exports = BrandCtrl;
