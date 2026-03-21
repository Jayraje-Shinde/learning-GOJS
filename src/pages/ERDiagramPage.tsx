import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import * as go from "gojs";
import PageHeader from "../components/layout/PageHeader";
import { mockTables, mockRelationships } from "../data/mockData";

export default function ERDiagramPage() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.GridLayout, {
        wrappingWidth: 1000,
        cellSize: new go.Size(10, 10),
        spacing: new go.Size(50, 50),
      }),
    });

    // Node template
    diagram.nodeTemplate = $(
      go.Node, "Auto",
      { movable: true, cursor: "grab" },
      $(go.Shape, "RoundedRectangle", {
        fill: "#1a1d27",
        stroke: "#2e3250",
        strokeWidth: 1.5,
        parameter1: 8,
      }),
      $(go.Panel, "Vertical", { defaultAlignment: go.Spot.Left },
        // Header
        $(go.Panel, "Auto", { stretch: go.GraphObject.Horizontal },
          $(go.Shape, "RoundedTopRectangle", { fill: "#1e2235", stroke: "transparent", parameter1: 8 }),
          $(go.Panel, "Horizontal", { padding: new go.Margin(8, 12, 8, 12) },
            $(go.TextBlock, {
              font: "11px monospace",
              stroke: "#818cf8",
              margin: new go.Margin(0, 6, 0, 0),
            }, new go.Binding("text", "schema", (s: string) => s + ".")),
            $(go.TextBlock, {
              font: "bold 13px monospace",
              stroke: "#ffffff",
            }, new go.Binding("text", "name")),
          )
        ),
        // Columns
        $(go.Panel, "Vertical", {
          padding: new go.Margin(4, 0, 6, 0),
          defaultAlignment: go.Spot.Left,
          itemTemplate: $(
            go.Panel, "Horizontal",
            { padding: new go.Margin(3, 12, 3, 12), defaultAlignment: go.Spot.Center },
            new go.Binding("background", "", (col) =>
              col.isPK ? "#1c2440" : col.isFK ? "#1c2932" : "transparent"
            ),
            $(go.TextBlock, {
              width: 22, font: "bold 9px monospace", textAlign: "center",
              margin: new go.Margin(0, 6, 0, 0),
            },
              new go.Binding("text", "", (col) => col.isPK ? "PK" : col.isFK ? "FK" : ""),
              new go.Binding("stroke", "", (col) => col.isPK ? "#f59e0b" : col.isFK ? "#34d399" : "transparent")
            ),
            $(go.TextBlock, {
              font: "12px monospace", stroke: "#e2e8f0",
              minSize: new go.Size(110, 0), margin: new go.Margin(0, 10, 0, 0),
            }, new go.Binding("text", "name")),
            $(go.TextBlock, {
              font: "11px monospace", stroke: "#818cf8", opacity: 0.8,
            }, new go.Binding("text", "type"))
          ),
        }, new go.Binding("itemArray", "columns"))
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes, corner: 10 },
      $(go.Shape, { stroke: "#4f5a8a", strokeWidth: 1.5, strokeDashArray: [5, 3] }),
      $(go.Shape, { toArrow: "OpenTriangle", stroke: "#4f5a8a", strokeWidth: 1.5, fill: "transparent" }),
      $(go.TextBlock, {
        segmentIndex: 0, segmentFraction: 0.1,
        font: "bold 11px monospace", stroke: "#34d399",
        background: "#0a0c14", margin: new go.Margin(0, 3),
      }, new go.Binding("text", "fromLabel")),
      $(go.TextBlock, {
        segmentIndex: -1, segmentFraction: 0.9,
        font: "bold 11px monospace", stroke: "#34d399",
        background: "#0a0c14", margin: new go.Margin(0, 3),
      }, new go.Binding("text", "toLabel")),
    );

    // Model
    diagram.model = new go.GraphLinksModel(
      mockTables.map((t) => ({
        key: t.name,
        name: t.name,
        schema: t.schema,
        columns: t.columns.map((c) => ({ name: c.name, type: c.type, isPK: c.isPK, isFK: c.isFK })),
      })),
      mockRelationships.map((r, i) => ({
        key: `link-${i}`,
        from: r.from,
        to: r.to,
        fromLabel: r.fromLabel,
        toLabel: r.toLabel,
        type: r.type,
      }))
    );

    return () => { diagram.div = null; };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <PageHeader
        title="ER Diagram"
        subtitle="Interactive entity-relationship diagram — drag to reposition"
      />
      <Box ref={divRef} sx={{ flex: 1, bgcolor: "#0a0c14" }} />
    </Box>
  );
}
