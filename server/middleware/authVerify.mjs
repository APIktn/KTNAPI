import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "การเข้าถึงถูกปฏิเสธกรุณา login ใหม่" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Token ไม่ถูกต้องกรุณา login ใหม่" });
    }
    req.user = user;
    next();
  });
};
