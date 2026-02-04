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
import { Slide, useMediaQuery } from "@mui/material";

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
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
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
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey((k) => k + 1);
  }, [prd]);

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
  const [rows, setRows] = useState([
    { lineKey: "new1", lineNo: 1, size: "", price: "", amount: "", note: "" },
  ]);

  /* ================= dnd ================= */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  /* ================= reset when new ================= */
  useEffect(() => {
    if (prd) return;

    setProductName("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setRows([
      { lineKey: "new1", lineNo: 1, size: "", price: "", amount: "", note: "" },
    ]);
    setTempCounter(1);
    setNotFound(false);
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

  useEffect(() => {
    if (!prd) return;
    fetchProduct(prd);
  }, [prd]);

  if (notFound)
    return (
      <Box sx={{ p: 2, borderRadius: 2 }}>
        <NotFound />
      </Box>
    );

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

  /* ===== drag reorder (api only, no modal success) ===== */
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

  /* ================= SAVE ================= */
  const handleSave = async () => {
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
        onClose: () => {
          setImage(null);
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

  const isMobile = useMediaQuery("(max-width:768px)");
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  /* ================= UI ================= */
  return (
    <>
      <Slide
        in
        direction="left"
        timeout={450}
        key={animateKey}
        appear={!isMobile}
      >
        <Box
          sx={{
            minHeight: "78vh",
            p: 2,
            borderRadius: 2,
            background:
              theme === "dark" ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.6)",

            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",

            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
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
            <Typography variant="h6">{isEdit ? prd : "new product"}</Typography>

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
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            mb={4}
          >
            {/* left: product info */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
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

            {/* right: image */}
            <Box
              component="label"
              sx={{
                width: { xs: "100%", md: 220 },
                height: { xs: 220, md: 220 },
                border: "2px dashed #ccc",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                alignSelf: { xs: "stretch", md: "flex-start" },
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
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>line</TableCell>
                      <TableCell>size</TableCell>
                      <TableCell>price</TableCell>
                      <TableCell>amount</TableCell>
                      <TableCell>note</TableCell>
                      <TableCell />
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
                              <TableCell>
                                {isNew ? (
                                  <BlockIcon fontSize="small" />
                                ) : (
                                  <IconButton
                                    size="small"
                                    {...attributes}
                                    {...listeners}
                                    sx={{
                                      touchAction: "none",
                                    }}
                                  >
                                    <DragIndicatorIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </TableCell>

                              <TableCell>{row.lineNo}</TableCell>

                              <TableCell>
                                <Select
                                  value={row.size}
                                  onChange={(e) =>
                                    setRows((prev) => {
                                      const copy = [...prev];
                                      copy[index].size = e.target.value;
                                      return copy;
                                    })
                                  }
                                  size="small"
                                  fullWidth
                                >
                                  {SIZE_OPTIONS.map((s) => (
                                    <MenuItem key={s} value={s}>
                                      {s}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </TableCell>

                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={row.price}
                                  onChange={(e) =>
                                    setRows((prev) => {
                                      const copy = [...prev];
                                      copy[index].price = e.target.value;
                                      return copy;
                                    })
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={row.amount}
                                  onChange={(e) =>
                                    setRows((prev) => {
                                      const copy = [...prev];
                                      copy[index].amount = e.target.value;
                                      return copy;
                                    })
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell>
                                <TextField
                                  size="small"
                                  value={row.note}
                                  onChange={(e) =>
                                    setRows((prev) => {
                                      const copy = [...prev];
                                      copy[index].note = e.target.value;
                                      return copy;
                                    })
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell>
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
      </Slide>

      {/* modal */}
      <AppModal open={modalOpen} {...modalConfig} />

      {/* loading */}
      <SavingBackdrop open={saving} text="saving product..." />
    </>
  );
}

export default AdminAddProduct;
