import fs from "fs";

function getSecret(name) {
  return fs.readFileSync(`/run/secrets/${name}`, "utf8").trim();
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || getSecret("access_token_secret");
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || getSecret("access_token_expiry");

export const MONGODB_URI = process.env.MONGODB_URI || getSecret("mongodb_uri");

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || getSecret("cloudinary_cloud_name");
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || getSecret("cloudinary_api_key");
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || getSecret("cloudinary_api_secret");