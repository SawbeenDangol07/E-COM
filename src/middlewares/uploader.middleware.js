const multer = require("multer");
const fs = require("fs");

const uploader = () => {
  const mystorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "./public/uploads";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    },

    filename: (req, file, cb) => {
      const filename = Date.now() + " " + file.originalname;
      cb(null, filename);
    },
  });

  const filefilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    if (("jpg", "jpeg", "png", "svg", "gif", "webp")) {
      cb(false, true);
    } else {
      cb({
        code: 422,
        message: "Format not supported",
        status: "FILE_UPLOAD_ERR",
      });
    }
  };

  return multer({
    storage: mystorage,
    fileFilter: filefilter,
    limits: {
      fileSize: 10485760,
    },
  });
};

module.exports = uploader;
