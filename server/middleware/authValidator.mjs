import con from "../db.mjs";

export const validateRegister = async (req, res, next) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({
      error: "email is required"
    });
  }

  try {
    const [rows] = await con.query(
      "select Id from tbl_mas_users where UserEmail = ? limit 1",
      [userEmail]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        error: "this email is already registered. please try another one."
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      error: "server error"
    });
  }
};

export const validateLogin = (req, res, next) => {
  const { userName, password } = req.body;
  const errors = {};

  if (!userName) {
    errors.userName = "username or email is required";
  }

  if (!password) {
    errors.password = "password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};



