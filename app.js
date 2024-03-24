import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { dbConnection } from "./Database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";
import path from "path";
import { fileURLToPath } from "url";

//resolving dirname for es module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
// This middleware parses the URL-encoded data and makes it available in req.body.

// When extended is set to true, the URL - encoded data parsed by Express will contain key - value pairs where the values can be of any type(i.e., it allows parsing of rich objects and arrays).When extended is set to false, only strings and arrays are parsed.

app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

//Use the clent app
app.use(express.static(path.join(__dirname, "/Frontend/dist")));

//Render frontend for any path that user goes to
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/Frontend/dist/index.html"))
);

dbConnection();

app.use(errorMiddleware);

export default app;
