import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  IconButton,
  Button,
  FormControl,
  InputLabel
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BlockIcon from "@mui/icons-material/Block";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/Theme";
import NotFound from "./NotFound";
import AppModal from "../component/Modal/AppModal";
import SavingBackdrop from "../component/SavingBackdrop";

const API_URL = import.meta.env.VITE_API_URL;
const SIZE_OPTIONS = ["100%", "200%", "300%", "400%", "800%", "1200%"];

/* ================= sortable row ================= */
function SortableRow({ id, disabled, children }) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id, disabled });

  return (
    <TableRow
      ref={setNodeRef}
      sx={{ minHeight: 72 }}
      style={
        disabled
          ? undefined
          : {
              transform: CSS.Transform.toString(transform),
              transition,
            }
      }
    >
      {children({ attributes, listeners })}
    </TableRow>
  );
}

function AdminAddProduct() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prd = searchParams.get("prd");
  const isEdit = Boolean(prd);

  /* ================= modal ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = (config) => {
    setModalConfig({
      ...config,
      onClose: () => {
        config.onClose?.();
        setModalOpen(false);
      },
    });
    setModalOpen(true);
  };

  /* ================= product ================= */
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [notFound, setNotFound] = useState(false);

  /* ================= rows ================= */
  const [tempCounter, setTempCounter] = useState(1);
  const [rows, setRows] = useState([]);

  /* ================= dnd ================= */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  /* ================= on ini ================= */
useEffect(() => {
  if (prd) {
    fetchProduct(prd);
  } else {
    setProductName("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setRows([
      {
        lineKey: "new1",
        lineNo: 1,
        size: "",
        price: "",
        amount: "",
        note: "",
      },
    ]);
    setTempCounter(1);
    setNotFound(false);
  }
}, [prd]);

  /* ================= GET PRODUCT ================= */
  const fetchProduct = async (code) => {
    try {
      const res = await axios.post(
        `${API_URL}/Product/getprod`,
        { status: "getprod", prdcode: code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setProductName(res.data.productName);
      setDescription(res.data.description);
      setImagePreview(res.data.mainImage || null);

      setRows(
        res.data.items.map((l) => ({
          lineKey: String(l.lineKey),
          lineNo: l.lineNo,
          size: l.size,
          price: l.price,
          amount: l.amount,
          note: l.note,
        })),
      );

      setTempCounter(res.data.items.length);
      setNotFound(false);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else {
        openModal({
          type: "error",
          title: "load failed",
          message:
            err.response?.data?.error ||
            err.response?.data?.message ||
            "cannot load product",
        });
      }
    }
  };

  /* ================= row handlers ================= */
  const handleAddRow = () => {
    const next = tempCounter + 1;
    setRows((prev) => [
      ...prev,
      {
        lineKey: `new${next}`,
        lineNo: prev.length + 1,
        size: "",
        price: "",
        amount: "",
        note: "",
      },
    ]);
    setRowErrors((prev) => [...prev, {}]);
    setTempCounter(next);
  };

  /* ===== delete row  ===== */
  const handleAskDeleteLine = (index, row) => {
    // temp row ลบทันที
    if (row.lineKey.startsWith("new")) {
      setRows((prev) =>
        prev
          .filter((_, i) => i !== index)
          .map((r, i) => ({ ...r, lineNo: i + 1 })),
      );
      setRowErrors((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // row จริง ถาม confirm
    openModal({
      mode: "confirm",
      type: "warning",
      title: "delete line",
      message: "are you sure you want to delete this line?",
      confirmText: "delete",
      onConfirm: async () => {
        try {
          await axios.post(
            `${API_URL}/Product/line`,
            { status: "deleteprodline", lineId: row.lineKey },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          setRows((prev) =>
            prev
              .filter((_, i) => i !== index)
              .map((r, i) => ({ ...r, lineNo: i + 1 })),
          );

          setModalOpen(false);
        } catch (err) {
          openModal({
            type: "error",
            title: "delete failed",
            message:
              err.response?.data?.error ||
              err.response?.data?.message ||
              "cannot delete line",
          });
        }
      },
    });
  };

  /* ===== drag reorder ===== */
  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const newRows = arrayMove(
      rows,
      rows.findIndex((r) => r.lineKey === active.id),
      rows.findIndex((r) => r.lineKey === over.id),
    ).map((r, i) => ({ ...r, lineNo: i + 1 }));

    setRows(newRows);

    try {
      await axios.post(
        `${API_URL}/Product/line`,
        {
          status: "updateprodline",
          lines: newRows.filter((r) => !r.lineKey.startsWith("new")),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
    } catch (err) {
      openModal({
        type: "error",
        title: "reorder failed",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "cannot update line order",
      });
    }
  };

  /* ================= loading ================= */
  const [saving, setSaving] = useState(false);

  /* ================= validate ================= */
  const [rowErrors, setRowErrors] = useState([]);
  const [productError, setProductError] = useState(false);

  const validateProd = () => {
    let valid = true;

    // product name
    if (!productName.trim()) {
      setProductError(true);
      valid = false;
    }

    // ไม่มีแถว → modal
    if (rows.length === 0) {
      openModal({
        type: "warning",
        title: "no item",
        message: "please add at least one item",
      });
      return false;
    }

    const errors = rows.map((r) => ({
      size: !r.size,
      price: !r.price,
      amount: !r.amount,
      note: false,
    }));

    setRowErrors(errors);

    const hasRowError = errors.some((e) => Object.values(e).some(Boolean));

    return valid && !hasRowError;
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!validateProd()) return;

    const formData = new FormData();
    formData.append("status", isEdit ? "updateprod" : "createprod");
    formData.append("productCode", prd || "");
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("items", JSON.stringify(rows));

    if (image) {
      formData.append("image", image);
      formData.append("imageType", "MAIN");
    }

    setSaving(true);

    try {
      const res = await axios.post(`${API_URL}/Product/saveprod`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSaving(false);
      openModal({
        type: "success",
        title: "save success",
        message: "product saved successfully",
        onClose: async () => {
          setImage(null);
          await fetchProduct(res.data.productCode);
          navigate(`/AdminAddProduct?prd=${res.data.productCode}`);
        },
      });
    } catch (err) {
      setSaving(false);
      openModal({
        type: "error",
        title: "save failed",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "cannot save product",
      });
    }
  };

  /* ================= delete product ================= */
  const handleDeleteProduct = () => {
    openModal({
      mode: "confirm",
      type: "warning",
      title: "delete product",
      message: "are you sure you want to delete this product?",
      confirmText: "delete",
      onConfirm: async () => {
        try {
          await axios.post(
            `${API_URL}/Product/delete`,
            { productCode: prd },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          openModal({
            type: "success",
            title: "delete success",
            message: "product deleted successfully",
            onClose: () => navigate("/AdminProduct"),
          });
        } catch (err) {
          openModal({
            type: "error",
            title: "delete failed",
            message:
              err.response?.data?.error ||
              err.response?.data?.message ||
              "cannot delete product",
          });
        }
      },
    });
  };

  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  return (
    <>
      {notFound ? (
        <Box sx={{ p: 2 }}>
          <NotFound />
        </Box>
      ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background:
                  theme === "dark"
                    ? "rgba(30,30,30,0.6)"
                    : "rgba(255,255,255,0.6)",

                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",

                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                mb: { xs: 3, md: 0 },
              }}
            >
              {/* header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
                mb={2}
              >
                <Typography variant="h6">
                  {isEdit ? prd : "new product"}
                </Typography>

                <Box
                  display="flex"
                  gap={1}
                  flexWrap="wrap"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate("/AdminAddProduct")}
                  >
                    new
                  </Button>

                  {isEdit && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteProduct}
                    >
                      delete
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    save
                  </Button>
                </Box>
              </Box>

              {/* product info */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                  mb: 4,
                }}
              >
                {/* left */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="product name"
                    value={productName}
                    fullWidth
                    error={productError}
                    helperText={productError ? "product name is required" : ""}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (productError && e.target.value.trim()) {
                        setProductError(false);
                      }
                    }}
                  />

                  <TextField
                    label="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={5}
                    fullWidth
                  />
                </Box>

                {/* right */}
                <Box
                  component="label"
                  sx={{
                    width: { xs: "100%", md: 220 },
                    height: 220,
                    flexShrink: 0,
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />

                  {image || imagePreview ? (
                    <img
                      src={image ? URL.createObjectURL(image) : imagePreview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Typography variant="h4" sx={{ color: "#aaa" }}>
                      +
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* table */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={rows.map((r) => r.lineKey)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box
                    sx={{
                      width: "100%",
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <Table
                      size="small"
                      sx={{
                        minWidth: 900,
                        width: "100%",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            sx={{
                              fontWeight: "bold",
                              fontSize: 16,
                              textAlign: "left",
                            }}
                          >
                            product stock
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row, index) => {
                          const isNew = row.lineKey.startsWith("new");

                          return (
                            <SortableRow
                              key={row.lineKey}
                              id={row.lineKey}
                              disabled={isNew}
                            >
                              {({ attributes, listeners }) => (
                                <>
                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    {isNew ? (
                                      <BlockIcon fontSize="small" />
                                    ) : (
                                      <IconButton
                                        size="small"
                                        {...attributes}
                                        {...listeners}
                                        sx={{ touchAction: "none" }}
                                      >
                                        <DragIndicatorIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    {row.lineNo}
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      width: 140,
                                    }}
                                  >
                                    <FormControl
                                      size="small"
                                      fullWidth
                                      error={rowErrors[index]?.size}
                                    >
                                      <InputLabel>size</InputLabel>

                                      <Select
                                        value={row.size}
                                        label="size"
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          setRows((prev) =>
                                            prev.map((r, i) =>
                                              i === index
                                                ? { ...r, size: value }
                                                : r,
                                            ),
                                          );

                                          if (rowErrors[index]?.size) {
                                            setRowErrors((prev) =>
                                              prev.map((err, i) =>
                                                i === index
                                                  ? { ...err, size: false }
                                                  : err,
                                              ),
                                            );
                                          }
                                        }}
                                      >
                                        {SIZE_OPTIONS.map((s) => (
                                          <MenuItem key={s} value={s}>
                                            {s}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </TableCell>

                                  <TableCell sx={{ verticalAlign: "middle" }}>
                                    <TextField
                                      label="price"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      value={row.price}
                                      error={rowErrors[index]?.price}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        setRows((prev) =>
                                          prev.map((r, i) =>
                                            i === index
                                              ? { ...r, price: value }
                                              : r,
                                          ),
                                        );

                                        if (rowErrors[index]?.price) {
                                          setRowErrors((prev) =>
                                            prev.map((err, i) =>
                                              i === index
                                                ? { ...err, price: false }
                                                : err,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell sx={{ verticalAlign: "middle" }}>
                                    <TextField
                                      label="amount"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      value={row.amount}
                                      error={rowErrors[index]?.amount}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        setRows((prev) =>
                                          prev.map((r, i) =>
                                            i === index
                                              ? { ...r, amount: value }
                                              : r,
                                          ),
                                        );

                                        if (rowErrors[index]?.amount) {
                                          setRowErrors((prev) =>
                                            prev.map((err, i) =>
                                              i === index
                                                ? { ...err, amount: false }
                                                : err,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell sx={{ verticalAlign: "middle" }}>
                                    <TextField
                                      label="note"
                                      size="small"
                                      type="text"
                                      fullWidth
                                      value={row.note}
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        setRows((prev) =>
                                          prev.map((r, i) =>
                                            i === index
                                              ? { ...r, note: value }
                                              : r,
                                          ),
                                        );
                                      }}
                                    />
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleAskDeleteLine(index, row)
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </>
                              )}
                            </SortableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </SortableContext>
              </DndContext>

              <Box mt={2}>
                <IconButton onClick={handleAddRow}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
      )}

      {/* modal */}
      <AppModal open={modalOpen} {...modalConfig} />

      {/* loading */}
      <SavingBackdrop open={saving} text="saving product..." />
    </>
  );
}

export default AdminAddProduct;
