import { useState } from "react";
import {
  Box, Drawer, List, ListItemButton,
  ListItemText, Typography, Divider, Chip, Tooltip,
} from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";

import ERDiagramPage from "../../pages/ERDiagramPage";
import AISummaryPage from "../../pages/AISummaryPage";
import TableSummariesPage from "../../pages/TableSummariesPage";
import DataQualityPage from "../../pages/DataQualityPage";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { id: "ai",      label: "AI Summary",         color: "#a78bfa" },
  { id: "er",      label: "ER Diagram",           color: "#34d399" },
  { id: "tables",  label: "Table Summaries",        color: "#60a5fa" },
  { id: "quality", label: "Data Quality",      color: "#fb923c" },
];

export default function ShellLayout() {
  const [activePage, setActivePage] = useState("ai");

  const renderPage = () => {
    switch (activePage) {
      case "ai":      return <AISummaryPage />;
      case "er":      return <ERDiagramPage />;
      case "tables":  return <TableSummariesPage />;
      case "quality": return <DataQualityPage />;
      default:        return <AISummaryPage />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#0a0c14" }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            bgcolor: "#0f1117",
            borderRight: "1px solid #1e2235",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
          <StorageIcon sx={{ color: "#818cf8", fontSize: 22 }} />
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 15,
              color: "#e2e8f0",
              letterSpacing: "-0.02em",
            }}
          >
            data<span style={{ color: "#818cf8" }}>dict</span>
            <span style={{ color: "#34d399" }}>.ai</span>
          </Typography>
        </Box>

        {/* DB Badge */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{
              bgcolor: "#1a1d27",
              border: "1px solid #2e3250",
              px: 1.5,
              py: 1,
            }}
          >
            <Typography sx={{ fontSize: 10, color: "#7c87a6", fontFamily: "monospace", mb: 0.3 }}>
              CONNECTED DATABASE
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", fontWeight: 600 }}>
              ecommerce_prod
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.8 }}>
              <Chip label="5 tables" size="small" sx={{ fontSize: 9, height: 18, bgcolor: "#1e2235", color: "#818cf8" }} />
              <Chip label="1.4M rows" size="small" sx={{ fontSize: 9, height: 18, bgcolor: "#1e2235", color: "#34d399" }} />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#1e2235" }} />

        {/* Nav Items */}
        <List sx={{ px: 1, pt: 1, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.id;
            return (
              <Tooltip key={item.id} title="" placement="right">
                <ListItemButton
                  onClick={() => setActivePage(item.id)}
                  sx={{
                    mb: 0.5,
                    bgcolor: active ? "#1a1d27" : "transparent",
                    border: active ? `1px solid #2e3250` : "1px solid transparent",
                    "&:hover": { bgcolor: "#1a1d27" },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? "#e2e8f0" : "#7c87a6",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        bgcolor: item.color,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        {/* Bottom status */}
        <Box sx={{ px: 2, py: 2, borderTop: "1px solid #1e2235" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 6, height: 6, bgcolor: "#34d399" }} />
            <Typography sx={{ fontSize: 11, color: "#4f5a8a", fontFamily: "monospace" }}>
              AI Agent Ready
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* ── Main Content ────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {renderPage()}
      </Box>

    </Box>
  );
}
