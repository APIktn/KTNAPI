export const validateInventory = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      error: "status is required",
    });
  }

  if (status !== "getinventory") {
    return res.status(403).json({
      success: false,
      error: "invalid inventory action",
    });
  }

  next();
};