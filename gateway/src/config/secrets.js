import fs from "fs";

function getSecret(name) {
  return fs.readFileSync(`/run/secrets/${name}`, "utf8").trim();
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || getSecret("access_token_secret");
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || getSecret("access_token_expiry");

