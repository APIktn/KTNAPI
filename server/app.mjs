import express from "express";
import cors from "cors";

import authenticateToken from "./middleware/authVerify.mjs";
import testRoute from "./routes/test.routes.mjs";
import authRouter from "./routes/auth.routes.mjs";
import productRoute from "./routes/prod.routes.mjs";
import inventoryRoute from "./routes/inventory.routes.mjs";
import profileRoute from "./routes/profile.routes.mjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Start!");
});

app.use("/test", authenticateToken, testRoute);
app.use("/auth", authRouter);
app.use("/Product", authenticateToken, productRoute);
app.use("/inventory", authenticateToken, inventoryRoute);
app.use("/user", authenticateToken, profileRoute);

export default app;
