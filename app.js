import crypto from "crypto";
import app from "./src/index.js";
import { PORT } from './src/config/env.config.js';

const port = PORT || 8050;

app.listen(port, () => console.log(`Server started on port ${port}`));

const body = JSON.stringify({ "deviceId": "1234567890" });
const cipher = crypto.createCipheriv('aes-256-cbc', 'TF3rqPuxEQlQf5uBXYaUMJvECOciaPAh', "QmL6umQQ6mlBS0fO");
let encryptedData = cipher.update(body, "utf-8", "hex");
encryptedData += cipher.final("hex");
