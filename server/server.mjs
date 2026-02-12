import dotenv from "dotenv";
import app from "./app.mjs";
import https from "https";
import selfsigned from "selfsigned";

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || "https://localhost";

const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365 });

const options = {
  key: pems.private,
  cert: pems.cert,
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}:${PORT}`);
});