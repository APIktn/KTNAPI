export const loginUser = async (email, password, role) => {
  const { data: user, error } = await pool
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("role", role)
    .single();

  if (error || !user) {
    throw new Error("ไม่พบผู้ใช้งานในระบบ");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("รหัสผ่านไม่ถูกต้อง");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      profile_image: user.profile_image,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      profile_image: user.profile_image,
    },
  };
};