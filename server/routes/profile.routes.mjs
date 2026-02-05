import express from "express";
import con from "../db.mjs";
import multer from "multer";
import cloudinary from "../utils/cloudinary.mjs";
import { profileValidator } from "../middleware/profileValidator.mjs";

const profileRoute = express.Router();

//////////////////////////////////////////////////
// upload config (memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
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

        let imageUrl = null;
        let imagePublicId = null;

        // ===== upload new image =====
        if (req.file) {
          if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
            return res.status(400).json({
              success: false,
              error: "invalid image type",
            });
          }

          const [[old]] = await con.query(
            `select Upload_Image_Id from tbl_mas_users where UserCode = ?`,
            [userCode]
          );

          if (old?.Upload_Image_Id) {
            await cloudinary.uploader.destroy(old.Upload_Image_Id);
          }

          const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
              folder: "bone_chop/profile",
            }
          );

          imageUrl = uploadResult.secure_url;
          imagePublicId = uploadResult.public_id;
        }


        await con.query(
          `
          update tbl_mas_users
          set
            FirstName = ?,
            LastName = ?,
            UserName = ?,
            Address = ?,
            Tel = ?,
            Upload_Image = coalesce(?, Upload_Image),
            Upload_Image_Id = coalesce(?, Upload_Image_Id),
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
            imageUrl,
            imagePublicId,
            userCode,
            new Date(),
            userCode,
          ],
        );

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

        return res.json({
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
