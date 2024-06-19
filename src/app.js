// import dotenv from 'dotenv';
// dotenv.config();
import mongoose from 'mongoose';
import crypto from "crypto";
import app from './index.js';
import { DB, PORT } from './config/env.config.js';

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB is connected!");
  });

const port = PORT || 8050;

app.listen(port, () => console.log(`Server started on port ${port}`));
app.get("/test",(req,res)=>{
  res.send("test-ram")
})

const body = JSON.stringify({"deviceId": "1234567890"})
const cipher = crypto.createCipheriv('aes-256-cbc', 'TF3rqPuxEQlQf5uBXYaUMJvECOciaPAh', "QmL6umQQ6mlBS0fO")
let encryptedData = cipher.update(body, "utf-8", "hex");
encryptedData += cipher.final("hex");
// console.log(encryptedData)

