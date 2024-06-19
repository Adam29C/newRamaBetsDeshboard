// src/config/env.config.js
import dotenv from "dotenv";

dotenv.config({ path: '../.env'});

export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3009";

export const SERVER_KEY = process.env.SERVER_KEY || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 43200000;
export const PORT = process.env.PORT || 3009;
export const DB =
  process.env.DB ||
  "";
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "";

  

