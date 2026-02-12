import { Router } from "express";
import bcrypt from "bcrypt";
import con from "../db.mjs";
import generateAvatarUrl from "../utils/avatarGenerator.mjs";
import generateUserCode from "../utils/generateUserCode.mjs";
import { validateRegister, validateLogin } from "../middleware/authValidator.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authRouter = Router();

////////////////////////////////////////////////// register

authRouter.post("/register", validateRegister, async (req, res) => {
  const { firstName, lastName, userEmail, password } = req.body
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
});

////////////////////////////////////////////////// login

authRouter.post("/login", validateLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await con.query(`
      select Id, UserCode, UserEmail, UserName, Password,
      FirstName, LastName, Profile_Image, Upload_Image
      from tbl_mas_users
      where lower(trim(UserEmail)) = lower(trim(?))
         or lower(trim(UserName))  = lower(trim(?))
      limit 1
    `, [username, username]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "user not found" });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) {
      return res.status(400).json({ error: "invalid password" });
    }

    const accessToken = jwt.sign(
      { id: user.Id, userCode: user.UserCode },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.Id, userCode: user.UserCode },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "login successful",
      token: accessToken,
      user: {
        userCode: user.UserCode,
        email: user.UserEmail,
        userName: user.UserName,
        firstName: user.FirstName,
        lastName: user.LastName,
      }
    });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

authRouter.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: "no refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, userCode: user.userCode },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: newAccessToken });
  });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "logout successful" });
});

export default authRouter