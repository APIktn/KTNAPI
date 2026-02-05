import express from "express";
import cors from "cors";

import authenticateToken from "./middleware/authVerify.mjs";
import testRoute from "./routes/test.routes.mjs";
import authRouter from "./routes/auth.routes.mjs";
import productRoute from "./routes/prod.routes.mjs";
import inventoryRoute from "./routes/inventory.routes.mjs";
import profileRoute from "./routes/profile.routes.mjs";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/test", authenticateToken, testRoute);
app.use("/auth", authRouter);
app.use("/Product", authenticateToken, productRoute);
app.use("/inventory", authenticateToken, inventoryRoute);
app.use("/user", authenticateToken, profileRoute);

export default app;
