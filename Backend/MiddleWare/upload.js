const multer = require("multer");

/**
 * Configure Multer (Memory Storage)
 * We use Memory Storage because we don't want to store files locally.
 * Files will be uploaded to Google Drive as streams.
 */
const storage = multer.memoryStorage();

/**
 * Filter: Allow only images and PDF/Doc documents
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF/DOC are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.FILE_SIZE_LIMIT) || 5 * 1024 * 1024, // Use env or default to 5MB
  },
});

module.exports = upload;
