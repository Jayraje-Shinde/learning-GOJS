import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderBottom: "1px solid #1e2235",
        bgcolor: "#0f1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#4f5a8a", fontFamily: "monospace" }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      {actions && <Box>{actions}</Box>}
    </Box>
  );
}
