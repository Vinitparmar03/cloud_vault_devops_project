import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "./secrets.js";
const client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
});

export default client;