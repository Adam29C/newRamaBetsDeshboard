import express from "express";
import cors from "cors";
import morgan from "morgan";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { mainRouter } from "./modules/index.js";
// import { mainRouter } from "./modules/index.js";


i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(middleware.handle(i18next));

app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

 app.use("/api", mainRouter);


export default app;
