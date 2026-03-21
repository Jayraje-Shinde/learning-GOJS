import { useState } from "react";
import {
  Box, Typography, Chip, LinearProgress, TextField, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import LinkIcon from "@mui/icons-material/Link";
import PageHeader from "../components/layout/PageHeader";
import { mockTables } from "../data/mockData";

export default function TableSummariesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(mockTables[0].name);

  const filtered = mockTables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const table = mockTables.find((t) => t.name === selected)!;

  const avgCompleteness =
    table.columns.reduce((sum, c) => sum + c.completeness, 0) / table.columns.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="Table Summaries"
        subtitle="Column-level schema and human-readable data dictionary"
      />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Table list sidebar */}
        <Box
          sx={{
            width: 200,
            borderRight: "1px solid #1e2235",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <TextField
              size="small"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: "#4f5a8a" }} />
                  </InputAdornment>
                ),
                sx: {
                  fontSize: 12,
                  fontFamily: "monospace",
                  bgcolor: "#1a1d27",
                  "& fieldset": { borderColor: "#2e3250" },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {filtered.map((t) => (
              <Box
                key={t.name}
                onClick={() => setSelected(t.name)}
                sx={{
                  px: 2,
                  py: 1.2,
                  cursor: "pointer",
                  bgcolor: selected === t.name ? "#1a1d27" : "transparent",
                  borderLeft: selected === t.name ? "2px solid #60a5fa" : "2px solid transparent",
                  "&:hover": { bgcolor: "#1a1d27" },
                }}
              >
                <Typography sx={{ fontSize: 12, color: selected === t.name ? "#e2e8f0" : "#7c87a6", fontFamily: "monospace" }}>
                  {t.name}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#4f5a8a", fontFamily: "monospace" }}>
                  {t.rowCount.toLocaleString()} rows
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Table detail */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>

          {/* Table meta */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
                {table.schema}.{table.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#4f5a8a", fontFamily: "monospace" }}>
                {table.rowCount.toLocaleString()} rows · {table.columns.length} columns · avg completeness {avgCompleteness.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          {/* Columns */}
          <Box
            sx={{
              bgcolor: "#1a1d27",
              border: "1px solid #2e3250",
              overflow: "hidden",
            }}
          >
            {/* Header row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "24px 1fr 120px 60px 120px",
                gap: 2,
                px: 2,
                py: 1,
                bgcolor: "#1e2235",
                borderBottom: "1px solid #2e3250",
              }}
            >
              {["", "Column", "Type", "Null", "Completeness"].map((h) => (
                <Typography key={h} sx={{ fontSize: 10, color: "#4f5a8a", fontFamily: "monospace", fontWeight: 700 }}>
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Column rows */}
            {table.columns.map((col, i) => (
              <Box
                key={col.name}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 120px 60px 120px",
                  gap: 2,
                  px: 2,
                  py: 1.2,
                  alignItems: "center",
                  borderBottom: i < table.columns.length - 1 ? "1px solid #1e2235" : "none",
                  bgcolor: col.isPK ? "#1c244080" : col.isFK ? "#1c293280" : "transparent",
                  "&:hover": { bgcolor: "#1e2235" },
                }}
              >
                {/* Badge */}
                <Box>
                  {col.isPK && <KeyIcon sx={{ fontSize: 14, color: "#f59e0b" }} />}
                  {col.isFK && <LinkIcon sx={{ fontSize: 14, color: "#34d399" }} />}
                </Box>
                {/* Name */}
                <Typography sx={{ fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" }}>
                  {col.name}
                </Typography>
                {/* Type */}
                <Typography sx={{ fontSize: 11, color: "#818cf8", fontFamily: "monospace" }}>
                  {col.type}
                </Typography>
                {/* Nullable */}
                <Chip
                  label={col.nullable ? "YES" : "NO"}
                  size="small"
                  sx={{
                    fontSize: 9, height: 16,
                    bgcolor: col.nullable ? "#2d1b1b" : "#1b2d1b",
                    color: col.nullable ? "#f87171" : "#34d399",
                  }}
                />
                {/* Completeness */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={col.completeness}
                    sx={{
                      flex: 1, height: 4, 
                      bgcolor: "#0f1117",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: col.completeness > 90 ? "#34d399" : col.completeness > 70 ? "#f59e0b" : "#f87171",
                        
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 10, color: "#7c87a6", fontFamily: "monospace", width: 36 }}>
                    {col.completeness}%
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
