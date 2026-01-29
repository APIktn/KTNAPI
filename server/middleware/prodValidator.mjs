export const validateProduct = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }

  // ===== CREATE / UPDATE PRODUCT =====
  if (status === "createprod" || status === "updateprod") {
    const { productName, description, items } = req.body;

    if (!productName?.trim()) {
      return res.status(400).json({ error: "product name is required" });
    }

    if (!description?.trim()) {
      return res.status(400).json({ error: "description is required" });
    }

    if (!items) {
      return res.status(400).json({ error: "product line is required" });
    }

    let parsedItems;
    try {
      parsedItems = JSON.parse(items);
    } catch {
      return res
        .status(400)
        .json({ error: "invalid product line format" });
    }

    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ error: "product line is required" });
    }

    req.parsedItems = parsedItems;
  }

  // ===== UPDATE LINE =====
  if (status === "updateprodline") {
    if (!req.body.lines && !req.body.lineId) {
      return res
        .status(400)
        .json({ error: "line data is required" });
    }
  }

  // ===== DELETE LINE =====
  if (status === "deleteprodline") {
    if (!req.body.lineId) {
      return res
        .status(400)
        .json({ error: "line id is required" });
    }
  }

  // ===== DELETE PRODUCT =====
  if (status === "delprod") {
    if (!req.body.productCode) {
      return res
        .status(400)
        .json({ error: "product code is required" });
    }
  }

  next();
};
