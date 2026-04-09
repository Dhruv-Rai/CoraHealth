const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure env is loaded if used in standalone scripts

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Folder name in Cloudinary (e.g. "artika/user@email.com/ProfilePhotos")
 * @returns {String} Secure URL to the uploaded file
 */
console.log("Cloudinary Configured with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING",
});

async function uploadFile(file, folder) {
  console.log("Starting cloudinary stream upload to folder:", folder);
  return new Promise((resolve, reject) => {
    // We use upload_stream since we are getting a buffer from Multer
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER_PREFIX || "artika"}/${folder}`, // Prefix with project name
        resource_type: "auto",      // Automatically detect if it's an image or raw (PDF/Doc)
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result.secure_url); // This is the final public link
      }
    );

    // Write the buffer to the stream
    uploadStream.end(file.buffer);
  });
}

/**
 * Extract Public ID from a Cloudinary URL
 * @param {String} url - Full Cloudinary URL
 * @returns {String} public_id
 */
function getPublicId(url) {
  if (!url) return null;
  // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
  // For raw files (PDF): https://res.cloudinary.com/cloud_name/raw/upload/v12345/folder/public_id.pdf
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;

  // The public_id starts after the version (e.g. v12345)
  // We join everything but remove the file extension from the last part
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/");
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Remove extension
  return publicId;
}

/**
 * Delete a file from Cloudinary (optional but good practice)
 * Handles both public_id and full URL
 */
async function deleteFile(idOrUrl) {
  try {
    if (!idOrUrl) return;
    const publicId = idOrUrl.startsWith("http") ? getPublicId(idOrUrl) : idOrUrl;
    if (!publicId) return;

    // For non-images (PDFs), we must specify resource_type: "raw"
    // Use "auto" in destroy is not supported directly, usually we try image first
    // then raw if it fails, OR just detect from URL.
    const resourceType = idOrUrl.includes("/raw/") ? "raw" : "image";

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Cloudinary Delete Result (${publicId}):`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getPublicId,
};
