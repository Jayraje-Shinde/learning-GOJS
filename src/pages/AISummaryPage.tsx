import {
  Box, Typography, LinearProgress, Chip, 
} from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import { mockAISummary } from "../data/mockData";

const StatCard = ({
  label, value, color,
}: {
  label: string; value: string | number; color: string;
}) => (
  <Box
    sx={{
      bgcolor: "#1a1d27",
      border: "1px solid #2e3250",
      borderRadius: 2,
      p: 2.5,
      flex: 1,
    }}
  >
    <Typography sx={{ fontSize: 11, color: "#7c87a6", fontFamily: "monospace", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 26, fontWeight: 700, color, fontFamily: "monospace" }}>
      {value}
    </Typography>
  </Box>
);

export default function AISummaryPage() {
  const s = mockAISummary;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="AI Business Summary"
        subtitle="Auto-generated schema analysis and business context"
      />

      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StatCard label="TOTAL TABLES"         value={s.totalTables}         color="#818cf8" />
          <StatCard label="RELATIONSHIPS"        value={s.totalRelationships}  color="#34d399" />
          <StatCard label="TOTAL ROWS"           value={s.totalRows}           color="#60a5fa" />
          <StatCard label="DATA HEALTH SCORE"   value={`${s.dataHealth}%`}    color="#fb923c" />
        </Box>

        {/* Health bar */}
        <Box
          sx={{
            bgcolor: "#1a1d27",
            border: "1px solid #2e3250",
            borderRadius: 2,
            p: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 12, color: "#e2e8f0", fontFamily: "monospace", fontWeight: 600 }}>
              Overall Data Health
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#fb923c", fontFamily: "monospace", fontWeight: 700 }}>
              {s.dataHealth}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={s.dataHealth}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#0f1117",
              "& .MuiLinearProgress-bar": { bgcolor: "#fb923c", borderRadius: 4 },
            }}
          />
        </Box>

        {/* AI Overview */}
        <Box
          sx={{
            bgcolor: "#1a1d27",
            border: "1px solid #2e3250",
            borderRadius: 2,
            p: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
              {s.title}
            </Typography>
            <Chip
              label="AI Generated"
              size="small"
              sx={{ fontSize: 9, height: 18, bgcolor: "#1e2235", color: "#a78bfa", ml: "auto" }}
            />
          </Box>
          <Typography sx={{ fontSize: 13, color: "#9ca3b8", lineHeight: 1.8, fontFamily: "monospace" }}>
            {s.overview}
          </Typography>
        </Box>

        {/* Key Insights */}
        <Box
          sx={{
            bgcolor: "#1a1d27",
            border: "1px solid #2e3250",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
              Key Insights
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {s.insights.map((insight, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: 1,
                    bgcolor: "#0f1117",
                    border: "1px solid #2e3250",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  <Typography sx={{ fontSize: 10, color: "#a78bfa", fontFamily: "monospace", fontWeight: 700 }}>
                    {i + 1}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: "#9ca3b8", fontFamily: "monospace", lineHeight: 1.6 }}>
                  {insight}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
