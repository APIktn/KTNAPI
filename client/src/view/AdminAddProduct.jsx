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

import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/Theme";
import NotFound from "./NotFound";
import AppModal from "../component/Modal/AppModal";

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

  /* ================= modal ================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const openModal = (config) => {
    setModalConfig({
      ...config,
      onClose: config.onClose || (() => setModalOpen(false)),
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
  useEffect(() => {
    if (!prd) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/Product/getprod`,
          { status: "getprod", prdcode: prd },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProductName(res.data.productName);
        setDescription(res.data.description);
        setImagePreview(res.data.image);
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
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else {
          openModal({
            type: "error",
            title: "load failed",
            message: "cannot load product",
          });
        }
      }
    };

    fetchProduct();
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

  /* ===== delete row (confirm + api, no success modal) ===== */
const handleAskDeleteLine = (index, row) => {
  // temp row → ลบทันที ไม่ต้อง modal
  if (row.lineKey.startsWith("new")) {
    setRows((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, lineNo: i + 1 }))
    );
    return;
  }

  // row จริง → ค่อยถาม confirm
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
          }
        );

        setRows((prev) =>
          prev
            .filter((_, i) => i !== index)
            .map((r, i) => ({ ...r, lineNo: i + 1 }))
        );

        setModalOpen(false);
      } catch (err) {
        openModal({
          type: "error",
          title: "delete failed",
          message: "cannot delete line",
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
        message: "cannot update line order",
      });
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("status", isEdit ? "updateprod" : "createprod");
    formData.append("productCode", prd || "");
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("items", JSON.stringify(rows));
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API_URL}/Product/saveprod`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      openModal({
        type: "success",
        title: "save success",
        message: "product saved successfully",
        onClose: () => navigate(`/AdminProduct?prd=${res.data.productCode}`),
      });
    } catch (err) {
      openModal({
        type: "error",
        title: "save failed",
        message: "cannot save product",
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
            message: "cannot delete product",
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
      <Box
        sx={{
          minHeight: "78vh",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
          borderRadius: 2,
          p: 3,
        }}
      >
        {/* header */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">new product</Typography>

          <Box display="flex" gap={1}>
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
            >
              save
            </Button>
          </Box>
        </Box>

        {/* product info */}
        <Box display="flex" gap={3} mb={4}>
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

          {/* image */}
          <Box
            component="label"
            sx={{
              width: 220,
              height: 220,
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
                src={
                  image
                    ? URL.createObjectURL(image)
                    : `${API_URL}${imagePreview}`
                }
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
                              onClick={() => handleAskDeleteLine(index, row)}
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
            </Table></Box>
          </SortableContext>
        </DndContext>

        <Box mt={2}>
          <IconButton onClick={handleAddRow}>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* modal */}
      <AppModal open={modalOpen} {...modalConfig} />
    </>
  );
}

export default AdminAddProduct;
