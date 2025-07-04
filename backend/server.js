import express from "express";
import configRoutes from "./routes/configRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { initDatabase } from "./utils/initDB.js";
import { encryptConfigFile } from "./utils/encryptConfigFile.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ALLOW_PORT, //domain
    credentials: true, //cookie
  })
);
app.use(cookieParser());

app.use("/api", configRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  encryptConfigFile();
  try {
    await initDatabase();
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
});
