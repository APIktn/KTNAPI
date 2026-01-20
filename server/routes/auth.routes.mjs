import { Router } from "express";
import bcrypt from "bcrypt";
import { loginUser } from "../controllers/authService.mjs";
import supabase from "../utils/db.mjs";
import { generateAvatarUrl } from "../utils/avatarGenerator.mjs";
import { validateRegister, validateLogin } from "../middlewares/validators.mjs";

const authRouter = Router();

authRouter.post("/register", validateRegister, async (req, res) => {
  const { firstname, lastname, email, password, tel_num } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = generateAvatarUrl(firstname, lastname);

    const { error } = await supabase.from("users").insert([
      {
        firstname,
        lastname,
        tel_num,
        email,
        password: hashedPassword,
        role: "user",
        profile_image: profileImage,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน: " + error.message });
  }
});

authRouter.post("/login/user", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password, "user");
    res.json({ message: "เข้าสู่ระบบสำเร็จ", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/login/admin", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password, "admin");
    res.json({ message: "เข้าสู่ระบบแอดมินสำเร็จ", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.json({ message: "ออกจากระบบสำเร็จ" });
});

authRouter.post("/register/technician", validateRegister, async (req, res) => {
  const { firstname, lastname, email, password, tel_num } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = generateAvatarUrl(firstname, lastname);

    const { error } = await supabase.from("users").insert([
      {
        firstname,
        lastname,
        tel_num,
        email,
        password: hashedPassword,
        role: "technician",
        profile_image: profileImage,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "ลงทะเบียนช่างเทคนิคสำเร็จ" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน: " + error.message });
  }
});

authRouter.post("/login/technician", validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password, "technician");
    res.json({ message: "เข้าสู่ระบบช่างเทคนิคสำเร็จ", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default authRouter;
