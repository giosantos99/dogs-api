import express from "express";
import cors from "cors";
import path from "node:path";

import authRoutes from "./src/routes/authRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import passwordRoutes from "./src/routes/passwordRoutes.js";
import photoRoutes from "./src/routes/photoRoutes.js";
import statsRoutes from "./src/routes/statsRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

import handleUploadError from "./src/middlewares/handleUploadError.js";
import handleError from "./src/middlewares/handleError.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.use("/uploads", express.static(path.resolve("src/uploads")));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Dogs API funcionando!",
  });
});

app.use("/jwt-auth/v1", authRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/photo", photoRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/user", userRoutes);

app.use(handleUploadError);

app.use((req, res) => {
  return res.status(404).json({
    message: "Rota não encontrada.",
  });
});

app.use(handleError);

export default app;
