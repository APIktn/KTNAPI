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

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ error: "การเข้าถึงถูกปฏิเสธสำหรับผู้ใช้งานทั่วไป" });

  next();
};

export const authorizeTechnician = (req, res, next) => {
  if (req.user.role !== "technician")
    return res
      .status(403)
      .json({ error: "การเข้าถึงถูกปฏิเสธสำหรับผู้ใช้งานทั่วไป" });

  next();
};
