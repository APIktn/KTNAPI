import dotenv from "dotenv";
import app from "./app.mjs";

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || "http://localhost";

app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}:${PORT}`);
});
