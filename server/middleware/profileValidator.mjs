import con from "../db.mjs";

export const profileValidator = async (req, res, next) => {
  const { status, userName } = req.body;
  const userCode = req.user?.userCode;

  const allowStatus = ["getprofile", "updateprofile"];

  if (!status || !allowStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "invalid profile action",
    });
  }

  // ===== check duplicate username =====
  if (status === "updateprofile" && userName) {
    try {
      const [[dup]] = await con.query(
        `
        select UserCode
        from tbl_mas_users
        where lower(trim(UserName)) = lower(trim(?))
          and UserCode <> ?
        limit 1
        `,
        [userName, userCode],
      );

      if (dup) {
        return res.status(409).json({
          success: false,
          error: "username already in use",
        });
      }
    } catch (err) {
      console.error("profileValidator error:", err);
      return res.status(500).json({
        success: false,
        error: "server error",
      });
    }
  }

  next();
};
