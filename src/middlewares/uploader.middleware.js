const multer = require("multer");
const fs = require("fs");

const uploader = () => {
  const mystorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "./public/uploads";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    },

    filename: (req, file, cb) => {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, filename);
    },
  });

  const filefilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png", "svg", "gif", "webp"];
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        {
          code: 422,
          message: "Format not supported",
          status: "FILE_UPLOAD_ERR",
        },
        false,
      );
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
