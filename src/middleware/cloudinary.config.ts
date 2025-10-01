import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import type { Options as MulterOptions } from "multer-storage-cloudinary";

try {
  process.loadEnvFile() // Node.js built-in API (introduced in Node v20.6.0) to load variables from a .env file directly into process.env. For older Node versions, the package dotenv was used for this.
} catch(error) {
  console.warn(".env file not found, using default environment values")
}

const cloudName = process.env.CLOUDINARY_NAME ?? "";
const apiKey = process.env.CLOUDINARY_KEY ?? "";
const apiSecret = process.env.CLOUDINARY_SECRET ?? "";

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary environment variables: CLOUDINARY_NAME, CLOUDINARY_KEY, or CLOUDINARY_SECRET");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// <// Debug: Check if environment variables are loaded
// console.log("Cloudinary config:", {
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY ? "***" + process.env.CLOUDINARY_KEY.slice(-4) : "undefined",
//   api_secret: process.env.CLOUDINARY_SECRET ? "***" + process.env.CLOUDINARY_SECRET.slice(-4) : "undefined"
// });>

interface CloudinaryParams {
  folder: string;
  allowed_formats?: string[];
  format?: (req: Express.Request, file: Express.Multer.File) => Promise<string> | string;
  resource_type?: "image" | "raw" | "video";
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png", "webp"],
    // format: async (req, file) => file.mimetype === "image/png" ? "png" : "jpg",

    folder: "herbs-shop-app", // The name of the folder where images will be stored in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  } as CloudinaryParams,
});

module.exports = multer({ storage });

export default multer({ storage });
