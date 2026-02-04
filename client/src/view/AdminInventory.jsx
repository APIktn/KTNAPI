import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grow,
} from "@mui/material";

import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import SavingBackdrop from "../component/SavingBackdrop";

const API_URL = import.meta.env.VITE_API_URL;

/* ================= debounce hook ================= */
function useDebounce(value, delay = 1000) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function AdminInventory() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const [animateKey, setAnimateKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);
  const debouncedPrice = useDebounce(priceRange, 1000);

  /* ===== delayed loading (0.5s) ===== */
  const loadingTimer = useRef(null);

  useEffect(() => {
    clearTimeout(loadingTimer.current);

    loadingTimer.current = setTimeout(() => {
      setLoading(true);
    }, 500);

    return () => clearTimeout(loadingTimer.current);
  }, [search, priceRange]);

  /* reset page when filter change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedPrice]);

  useEffect(() => {
  if (search === "" && priceRange[0] === 0 && priceRange[1] === 100000) {
    setLoading(false);
    clearTimeout(loadingTimer.current);
  }
}, [search, priceRange]);

  /* ================= fetch inventory ================= */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/inventory/getinventory`,
          {
            status: "getinventory",
            search: debouncedSearch,
            priceMin: debouncedPrice[0],
            priceMax: debouncedPrice[1],
            page,
            limit,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProducts(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
        setAnimateKey((k) => k + 1);
      } catch (err) {
        console.error("fetch inventory error:", err);
      } finally {
        clearTimeout(loadingTimer.current);
        setLoading(false);
      }
    };

    fetchInventory();
  }, [debouncedSearch, debouncedPrice, page]);

  return (
    <>
      <Box
        sx={{
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* search + filter */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="search product / code"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}
          />

          <Box sx={{ width: 320 }}>
            <Typography variant="caption">
              price range: {priceRange[0]} - {priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              min={0}
              max={100000}
              onChange={(_, v) => setPriceRange(v)}
              valueLabelDisplay="auto"
              disableSwap
            />
          </Box>
        </Box>

        {/* cards */}
        <div className="row g-3" key={animateKey}>
          {products.map((p, index) => {
            const isAvailable = p.lines.some((l) => Number(l.amount) > 0);

            return (
              <div
                key={p.productCode}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <Grow in timeout={400 + index * 80}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 250,
                        height: 250,
                        objectFit: "contain",
                        mx: "auto",
                      }}
                      image={p.image || ""}
                      alt={p.productName}
                    />

                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="subtitle1" noWrap>
                        {p.productName}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {p.productCode}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          color: isAvailable ? "success.main" : "error.main",
                        }}
                      >
                        {isAvailable ? "available" : "sold"}
                      </Typography>
                    </CardContent>

                    <div className="p-2 mt-auto">
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={() =>
                          navigate(`/AdminAddProduct?prd=${p.productCode}`)
                        }
                      >
                        manage
                      </Button>
                    </div>
                  </Card>
                </Grow>
              </div>
            );
          })}
        </div>

        {/* pagination */}
        <Box
          sx={{
            mt: "auto",
            pt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            prev
          </Button>

          <Typography>
            {page} / {totalPages}
          </Typography>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            next
          </Button>
        </Box>
      </Box>

      <SavingBackdrop open={loading} text="loading inventory..." />
    </>
  );
}

export default AdminInventory;
