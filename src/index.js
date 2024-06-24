import express from "express";
import cors from "cors";
import morgan from "morgan";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { mainRouter } from './modules/index.js';
import './conn.js'; // Assuming this connects to your MongoDB
// import './seeders/adminSeeders.js'

// Initialize i18next with file system backend and HTTP middleware
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en", // Default language if detection fails
    backend: {
      loadPath: "./locales/{{lng}}/translation.json", // Path to language files
    },
  });

const corsOptions = {
  origin: "*", // Allow requests from any origin, change as per your requirements
  credentials: true, // Enable credentials in CORS
  optionSuccessStatus: 200, // Return 200 for successful preflight requests
};

const app = express();

// Middleware
app.use(cors(corsOptions)); // Enable CORS with options
app.use(middleware.handle(i18next)); // i18next middleware for language detection
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // Morgan for logging requests

// Custom middleware to log request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api", mainRouter); // Mount mainRouter under /api prefix

export default app;
