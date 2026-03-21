import {
  Box, Typography, LinearProgress, Chip,
} from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import { mockTables } from "../data/mockData";

const getStatus = (val: number) => {
  if (val >= 95) return { label: "Healthy", color: "#34d399" };
  if (val >= 75) return { label: "Warning", color: "#f59e0b" };
  return { label: "Critical", color: "#f87171"};
};

const metrics = [
  { label: "Completeness", desc: "Non-null values across all columns" },
  { label: "Consistency",  desc: "Values conforming to expected format" },
  { label: "Freshness",    desc: "Data updated within expected window" },
  { label: "Uniqueness",   desc: "Absence of duplicate records" },
];

// Dummy scores per table per metric
const scores: Record<string, number[]> = {
  users:       [93.6, 97.0, 88.0, 99.1],
  orders:      [99.1, 98.5, 91.0, 100],
  products:    [87.2, 92.0, 74.0, 98.5],
  order_items: [99.8, 99.0, 95.0, 100],
  categories:  [71.0, 95.0, 82.0, 100],
};

export default function DataQualityPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="Data Quality"
        subtitle="Completeness · Consistency · Freshness · Uniqueness"
      />

      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>

        {/* Metric legend */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          {metrics.map((m) => (
            <Box
              key={m.label}
              sx={{
                flex: 1, bgcolor: "#1a1d27", border: "1px solid #2e3250",
                borderRadius: 2, p: 2,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace", mb: 0.3 }}>
                {m.label}
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#4f5a8a", fontFamily: "monospace" }}>
                {m.desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Table quality rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mockTables.map((table) => {
            const tableScores = scores[table.name] ?? [80, 80, 80, 80];
            const overall = tableScores.reduce((a, b) => a + b, 0) / tableScores.length;
            const status = getStatus(overall);

            return (
              <Box
                key={table.name}
                sx={{
                  bgcolor: "#1a1d27",
                  border: "1px solid #2e3250",
                  borderRadius: 2,
                  p: 2.5,
                }}
              >
                {/* Table header */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                 
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>
                    {table.schema}.{table.name}
                  </Typography>
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{ fontSize: 9, height: 18, bgcolor: "#0f1117", color: status.color, ml: 0.5 }}
                  />
                  <Typography sx={{ fontSize: 11, color: "#4f5a8a", fontFamily: "monospace", ml: "auto" }}>
                    Overall: {overall.toFixed(1)}%
                  </Typography>
                </Box>

                {/* Metric bars */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 2,
                  }}
                >
                  {metrics.map((m, i) => {
                    const score = tableScores[i];
                    const s = getStatus(score);
                    return (
                      <Box key={m.label}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography sx={{ fontSize: 10, color: "#7c87a6", fontFamily: "monospace" }}>
                            {m.label}
                          </Typography>
                          <Typography sx={{ fontSize: 10, color: s.color, fontFamily: "monospace", fontWeight: 700 }}>
                            {score}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          sx={{
                            height: 5, borderRadius: 2,
                            bgcolor: "#0f1117",
                            "& .MuiLinearProgress-bar": { bgcolor: s.color, borderRadius: 2 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
