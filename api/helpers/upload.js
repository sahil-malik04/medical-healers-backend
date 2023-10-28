const multer = require("multer");

const imageUplaod = (folder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
      const extension = file.originalname.split(".")[1];
      cb(null, `${Date.now()}.${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.includes("jpeg") ||
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("octet-stream")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  let upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload.single("image");
};

module.exports = imageUplaod;
