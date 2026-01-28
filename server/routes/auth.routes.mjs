import { Router } from "express";
import bcrypt from "bcrypt";
import con from "../db.mjs";
import generateAvatarUrl from "../utils/avatarGenerator.mjs";
import generateUserCode from "../utils/generateUserCode.mjs";
import { validateRegister, validateLogin } from "../middleware/authValidator.mjs";

const authRouter = Router();

////////////////////////////////////////////////// register

authRouter.post("/register", validateRegister, async (req, res) => {
  const { firstName, lastName, userEmail, password, status } = req.body

  if (status == "register") {
    try {
      const userCode = await generateUserCode(con); // gen code
      const hashedPassword = await bcrypt.hash(password, 10); // encryp
      const profileImage = generateAvatarUrl(firstName, lastName); // gen pic

      await con.query(
        `INSERT INTO tbl_mas_users (
    UserCode, UserEmail, Password, FirstName, LastName,
    Profile_Image, CreateBy, CreateDateTime, UpdateBy, UpdateDateTime
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userCode,
          userEmail,
          hashedPassword,
          firstName,
          lastName,
          profileImage,
          userCode,
          new Date(),
          userCode,
          new Date()
        ]
      );

      res.status(201).json({ message: "registration successful" });

    } catch (error) {
      // unique ซ้ำ
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          error: "we're experiencing high registration traffic. please try again later."
        });
      }

      res.status(500).json({
        error: "server error"
      });
    }
  }
});

////////////////////////////////////////////////// login

authRouter.post("/login", validateLogin, async (req, res) => {
  const { userName, password } = req.body;

  try {
    const [rows] = await con.query(
      `select Id, UserCode, UserEmail, UserName, Password
       from tbl_mas_users
       where UserEmail = ? OR UserName = ?
       limit 1`,
      [userName, userName]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "ไม่พบผู้ใช้งานในระบบ"
      });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) {
      return res.status(400).json({
        error: "รหัสผ่านไม่ถูกต้อง"
      });
    }

    // สร้าง token
    const token = jwt.sign(
      {
        id: user.Id,
        userCode: user.UserCode,
        email: user.UserEmail
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // แจก token
    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        userCode: user.UserCode,
        email: user.UserEmail,
        userName: user.UserName
      }
    });

  } catch (err) {
    res.status(500).json({
      error: "server error"
    });
  }
});

export default authRouter