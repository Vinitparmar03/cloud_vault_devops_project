import fs from "fs";

function getSecret(name) {
  return fs.readFileSync(`/run/secrets/${name}`, "utf8").trim();
}

export const ACCESS_TOKEN_SECRET = getSecret("access_token_secret");
export const REFRESH_TOKEN_SECRET = getSecret("refresh_token_secret");

export const ACCESS_TOKEN_EXPIRY = getSecret("access_token_expiry");
export const REFRESH_TOKEN_EXPIRY = getSecret("refresh_token_expiry");

export const MONGODB_URI = getSecret("mongodb_uri");

export const GOOGLE_CLIENT_ID = getSecret("google_client_id");
export const GOOGLE_CLIENT_SECRET = getSecret("google_client_secret");
