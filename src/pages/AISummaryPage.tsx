import {
  Box, Typography, LinearProgress, Chip, Button, TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import { mockAISummary, mockChatBot } from "../data/mockData";

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

type AISummaryPageProps = {
  onOpenTableColumn?: (tableName: string, columnName?: string) => void;
};

export default function AISummaryPage({ onOpenTableColumn }: AISummaryPageProps) {
  const s = mockAISummary;
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const insightActions: Record<number, { tableName: string; columnName?: string; cta: string }> = {
    0: { tableName: "orders", cta: "Open orders table" },
    1: { tableName: "products", columnName: "description", cta: "Open products.description" },
    2: { tableName: "categories", columnName: "parent_id", cta: "Open categories.parent_id" },
    3: { tableName: "order_items", columnName: "unit_price", cta: "Open order_items.unit_price" },
  };

  const sendQuery = () => {
    const normalizedInput = query.trim();
    if (!normalizedInput) return;

    const matchedSuggestion = mockChatBot.suggestions.find(
      (item) => item.toLowerCase() === normalizedInput.toLowerCase()
    );

    const response = matchedSuggestion
      ? mockChatBot.responses[matchedSuggestion]
      : "This prototype responds to suggested schema questions. Select one of the suggested prompts for a calibrated answer based on the current mock dataset.";

    setMessages((prev) => [
      ...prev,
      { role: "user", text: normalizedInput },
      { role: "bot", text: response },
    ]);
    setQuery("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                {insightActions[i] && (
                  <Button
                    size="small"
                    onClick={() => onOpenTableColumn?.(insightActions[i].tableName, insightActions[i].columnName)}
                    sx={{
                      ml: "auto",
                      minWidth: "fit-content",
                      whiteSpace: "nowrap",
                      fontSize: 10,
                      textTransform: "none",
                      color: "#60a5fa",
                      border: "1px solid #2e3250",
                      bgcolor: "#0f1117",
                      "&:hover": { bgcolor: "#1e2235" },
                    }}
                  >
                    {insightActions[i].cta}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Schema Intelligence Chatbot */}
        <Box
          sx={{
            bgcolor: "#1a1d27",
            border: "1px solid #2e3250",
            borderRadius: 2,
            p: 2.5,
            mt: 3,
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace", mb: 1.5 }}>
            Schema Intelligence Chatbot (Prototype)
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {mockChatBot.suggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => setQuery(suggestion)}
                sx={{
                  fontSize: 10,
                  color: "#a5b4fc",
                  bgcolor: "#1e2235",
                  border: "1px solid #2e3250",
                  "&:hover": { bgcolor: "#242b45" },
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: 1,
              minHeight: 220,
              overflow: "auto",
              mb: 1.5,
              pr: 0.5,
            }}
          >
            {messages.length === 0 && (
              <Typography sx={{ fontSize: 12, color: "#7c87a6", fontFamily: "monospace" }}>
                Select a suggested question, then press Send to view a schema-aware response.
              </Typography>
            )}
            {messages.map((msg, idx) => (
              <Box
                key={`${msg.role}-${idx}`}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "86%",
                  px: 1.2,
                  py: 0.9,
                  borderRadius: 1.5,
                  bgcolor: msg.role === "user" ? "#1e3a8a" : "#0f1117",
                  border: "1px solid #2e3250",
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#dbeafe", fontFamily: "monospace", lineHeight: 1.6 }}>
                  {msg.text}
                </Typography>
              </Box>
            ))}
            <Box ref={messagesEndRef} />
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about this schema..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendQuery();
                }
              }}
              InputProps={{
                sx: {
                  fontSize: 12,
                  fontFamily: "monospace",
                  bgcolor: "#0f1117",
                  color: "#e2e8f0",
                  "& fieldset": { borderColor: "#2e3250" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendQuery}
              sx={{
                fontFamily: "monospace",
                textTransform: "none",
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Send
            </Button>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}