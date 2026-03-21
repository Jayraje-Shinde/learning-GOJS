import { useState } from "react";
import {
  Box, Typography, Chip, LinearProgress, TextField,
  InputAdornment, Divider,
} from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import { mockTables } from "../data/mockData";

const CONSTRAINT_COLORS: Record<string, { bg: string; text: string }> = {
  "PRIMARY KEY": { bg: "#2d2200",  text: "#f59e0b" },
  "FOREIGN KEY": { bg: "#0d2918",  text: "#34d399" },
  "UNIQUE":      { bg: "#1a1040",  text: "#a78bfa" },
  "CHECK":       { bg: "#1a1a2e",  text: "#60a5fa" },
};

export default function TableSummariesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(mockTables[0].name);

  const filtered = mockTables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const table = mockTables.find((t) => t.name === selected)!;

  const avgCompleteness =
    table.columns.reduce((sum, c) => sum + c.completeness, 0) / table.columns.length;

  const pkColumns  = table.columns.filter((c) => c.isPK);
  const fkColumns  = table.columns.filter((c) => c.isFK);
  const reqColumns = table.columns.filter((c) => c.required);
  const optColumns = table.columns.filter((c) => !c.required);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="Table Summaries"
        subtitle="Column-level schema and human-readable data dictionary"
      />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ───────────────────────────────── */}
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
                startAdornment: <InputAdornment position="start" />,
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

        {/* ── Main detail area ──────────────────────── */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Table title */}
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
              {table.schema}.{table.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#4f5a8a", fontFamily: "monospace" }}>
              {table.rowCount.toLocaleString()} rows · {table.columns.length} columns · avg completeness {avgCompleteness.toFixed(1)}%
            </Typography>
          </Box>

          {/* ── Metadata Panel ──────────────────────── */}
          <Box
            sx={{
              bgcolor: "#1a1d27",
              border: "1px solid #2e3250",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Purpose summary */}
            <Box sx={{ p: 2, borderBottom: "1px solid #1e2235" }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", fontFamily: "monospace", letterSpacing: "0.06em", mb: 0.8 }}>
                TABLE PURPOSE
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3b8", fontFamily: "monospace", lineHeight: 1.7 }}>
                {table.summary}
              </Typography>
            </Box>

            {/* Quick stats */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1e2235" }}>
              {[
                { label: "PRIMARY KEYS", value: pkColumns.length,  color: "#f59e0b" },
                { label: "FOREIGN KEYS", value: fkColumns.length,  color: "#34d399" },
                { label: "REQUIRED",     value: reqColumns.length, color: "#60a5fa" },
                { label: "OPTIONAL",     value: optColumns.length, color: "#7c87a6" },
              ].map((stat, i, arr) => (
                <Box
                  key={stat.label}
                  sx={{
                    p: 1.5,
                    borderRight: i < arr.length - 1 ? "1px solid #1e2235" : "none",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "monospace" }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: 9, color: "#4f5a8a", fontFamily: "monospace", letterSpacing: "0.06em" }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Constraints */}
            <Box sx={{ p: 2, borderBottom: "1px solid #1e2235" }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", fontFamily: "monospace", letterSpacing: "0.06em", mb: 1.2 }}>
                CONSTRAINTS
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {table.constraints.map((c, i) => {
                  const colors = CONSTRAINT_COLORS[c.type] ?? { bg: "#1e2235", text: "#e2e8f0" };
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.2,
                        bgcolor: "#0f1117",
                        borderRadius: 1.5,
                        border: "1px solid #1e2235",
                      }}
                    >
                      <Chip
                        label={c.type}
                        size="small"
                        sx={{
                          fontSize: 9, height: 18, flexShrink: 0,
                          bgcolor: colors.bg, color: colors.text,
                          fontFamily: "monospace", fontWeight: 700,
                        }}
                      />
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flex: 1, alignItems: "center" }}>
                        {c.columns.map((col) => (
                          <Typography
                            key={col}
                            sx={{
                              fontSize: 11, color: "#e2e8f0", fontFamily: "monospace",
                              bgcolor: "#1e2235", px: 0.8, py: 0.2, borderRadius: 0.5,
                            }}
                          >
                            {col}
                          </Typography>
                        ))}
                        {"references" in c && c.references && (
                          <Typography sx={{ fontSize: 11, color: "#34d399", fontFamily: "monospace", ml: 0.5 }}>
                            → {c.references}
                          </Typography>
                        )}
                        {"definition" in c && c.definition && (
                          <Typography sx={{ fontSize: 11, color: "#60a5fa", fontFamily: "monospace", ml: 0.5, opacity: 0.8 }}>
                            {c.definition}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Required / Optional pills */}
            <Box sx={{ p: 2, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontSize: 10, color: "#4f5a8a", fontFamily: "monospace" }}>
                Required:
              </Typography>
              {reqColumns.map((c) => (
                <Chip key={c.name} label={c.name} size="small"
                  sx={{ fontSize: 10, height: 20, bgcolor: "#1e2235", color: "#60a5fa", fontFamily: "monospace" }}
                />
              ))}
              {optColumns.length > 0 && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: "#2e3250", mx: 0.5 }} />
                  <Typography sx={{ fontSize: 10, color: "#4f5a8a", fontFamily: "monospace" }}>
                    Optional:
                  </Typography>
                  {optColumns.map((c) => (
                    <Chip key={c.name} label={c.name} size="small"
                      sx={{ fontSize: 10, height: 20, bgcolor: "#1e2235", color: "#7c87a6", fontFamily: "monospace" }}
                    />
                  ))}
                </>
              )}
            </Box>
          </Box>

          {/* ── Columns Table ───────────────────────── */}
          <Box
            sx={{
              bgcolor: "#1a1d27",
              border: "1px solid #2e3250",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "24px 1fr 130px 60px 80px 120px",
                gap: 2, px: 2, py: 1,
                bgcolor: "#1e2235",
                borderBottom: "1px solid #2e3250",
              }}
            >
              {["", "Column", "Type", "Null", "Default", "Completeness"].map((h) => (
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
                  gridTemplateColumns: "24px 1fr 130px 60px 80px 120px",
                  gap: 2,
                  px: 2,
                  mx: 2,
                  py: 1.2,
                  alignItems: "center",
                  borderBottom: i < table.columns.length - 1 ? "1px solid #1e2235" : "none",
                  bgcolor: col.isPK ? "#1c244080" : col.isFK ? "#1c293280" : "transparent",
                  "&:hover": { bgcolor: "#1e2235" },
                }}
              >
                {/* PK / FK text badge */}
                <Typography
                  sx={{
                    fontSize: 9, fontWeight: 700, fontFamily: "monospace",
                    color: col.isPK ? "#f59e0b" : col.isFK ? "#34d399" : "transparent",
                  }}
                >
                  {col.isPK ? "PK" : col.isFK ? "FK" : "·"}
                </Typography>

                {/* Column name + optional badge */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" }}>
                    {col.name}
                  </Typography>
                  {!col.required && (
                    <Chip label="opt" size="small"
                      sx={{ fontSize: 9, height: 15, bgcolor: "#1e2235", color: "#7c87a6" }}
                    />
                  )}
                </Box>

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

                {/* Default value */}
                <Typography sx={{ fontSize: 11, fontFamily: "monospace", color: col.defaultValue ? "#f59e0b" : "#2e3250" }}>
                  {col.defaultValue ?? "—"}
                </Typography>

                {/* Completeness bar */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={col.completeness}
                    sx={{
                      flex: 1, height: 4, borderRadius: 2, bgcolor: "#0f1117",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: col.completeness > 90 ? "#34d399" : col.completeness > 70 ? "#f59e0b" : "#f87171",
                        borderRadius: 2,
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