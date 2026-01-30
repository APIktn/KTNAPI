import express from "express";
import con from "../db.mjs";
import multer from "multer";
import path from "path";
import fs from "fs";

import { profileValidator } from "../middleware/profileValidator.mjs";
import generateAvatarName from "../utils/generateAvatarName.mjs";

const profileRoute = express.Router();

//////////////////////////////////////////////////
// upload config
const uploadDir = path.join("asset", "Profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, generateAvatarName(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//////////////////////////////////////////////////
// get / update profile
profileRoute.post(
  "/profile",
  upload.single("image"),
  profileValidator,
  async (req, res) => {
    const { status } = req.body;
    const userCode = req.user?.userCode;

    if (!userCode) {
      return res.status(401).json({
        success: false,
        error: "unauthorized",
      });
    }

    try {
      /* ================= get profile ================= */
      if (status === "getprofile") {
        const [[user]] = await con.query(
          `
          select
            UserCode,
            UserEmail,
            UserName,
            FirstName,
            LastName,
            Address,
            Tel,
            Profile_Image,
            Upload_Image
          from tbl_mas_users
          where UserCode = ?
          limit 1
          `,
          [userCode],
        );

        if (!user) {
          return res.status(404).json({
            success: false,
            error: "user not found",
          });
        }

        return res.json({
          success: true,
          user: {
            userCode: user.UserCode,
            email: user.UserEmail,
            userName: user.UserName,
            firstName: user.FirstName,
            lastName: user.LastName,
            address: user.Address,
            tel: user.Tel,
            imageProfile: user.Profile_Image,
            imageUpload: user.Upload_Image,
            displayName: user.UserName
              ? user.UserName
              : `${user.FirstName} ${user.LastName}`,
          },
        });
      }

      /* ================= update profile ================= */
      if (status === "updateprofile") {
        const { firstName, lastName, userName, address, tel } = req.body;

        const imagePath = req.file
          ? `/asset/Profile/${req.file.filename}`
          : null;

        const [updateResult] = await con.query(
          `
          update tbl_mas_users
          set
            FirstName = ?,
            LastName = ?,
            UserName = ?,
            Address = ?,
            Tel = ?,
            Upload_Image = coalesce(?, Upload_Image),
            UpdateBy = ?,
            UpdateDateTime = ?
          where UserCode = ?
          `,
          [
            firstName,
            lastName,
            userName,
            address,
            tel,
            imagePath,
            userCode,
            new Date(),
            userCode,
          ],
        );

        // ✅ เช็คว่ามีการ update จริง
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            error: "user not found",
          });
        }

        // ✅ select user ใหม่ (source of truth)
        const [[u]] = await con.query(
          `
          select
            UserCode,
            UserEmail,
            UserName,
            FirstName,
            LastName,
            Profile_Image,
            Upload_Image
          from tbl_mas_users
          where UserCode = ?
          limit 1
          `,
          [userCode],
        );

        return res.status(200).json({
          success: true,
          message: "profile updated",
          user: {
            userCode: u.UserCode,
            email: u.UserEmail,
            userName: u.UserName,
            firstName: u.FirstName,
            lastName: u.LastName,
            imageProfile: u.Profile_Image,
            imageUpload: u.Upload_Image,
            displayName: u.UserName
              ? u.UserName
              : `${u.FirstName} ${u.LastName}`,
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: "invalid action",
      });
    } catch (err) {
      console.error("profile error:", err);
      res.status(500).json({
        success: false,
        error: "server error",
      });
    }
  },
);

export default profileRoute;
