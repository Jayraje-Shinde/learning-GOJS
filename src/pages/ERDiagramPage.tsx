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

    try {
      go.GraphObject.defineBuilder("PanelExpanderButton", (args) => {
        const targetName = go.GraphObject.takeBuilderArgument(args, "COLUMNS");
        return $(go.Panel, "Auto",
          {
            cursor: "pointer",
            isActionable: true,
            click: (_e: go.InputEvent, obj: go.GraphObject) => {
              const part = obj.part;
              if (!(part instanceof go.Node)) return;
              const panel = part.findObject(targetName);
              if (!(panel instanceof go.Panel)) return;
              panel.visible = !panel.visible;
              const icon = obj instanceof go.Panel ? obj.findObject("EXPAND_ICON") : null;
              if (icon instanceof go.Shape) {
                icon.figure = panel.visible ? "TriangleDown" : "TriangleRight";
              }
            },
          },
          $(go.Shape, "RoundedRectangle", {
            fill: "transparent",
            stroke: "transparent",
            desiredSize: new go.Size(18, 18),
          }),
          $(go.Shape, "TriangleRight", {
            name: "EXPAND_ICON",
            stroke: "#818cf8",
            fill: "transparent",
            desiredSize: new go.Size(8, 8),
          }),
        );
      });
    } catch {}

    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true,
      layout: $(go.GridLayout, {
        wrappingWidth: 1000,
        cellSize: new go.Size(10, 10),
        spacing: new go.Size(50, 50),
      }),
    });

    const clearHighlights = () => {
      diagram.clearHighlighteds();
      diagram.nodes.each((node) => { node.isHighlighted = false; });
      diagram.links.each((link) => { link.isHighlighted = false; });
    };

    const highlightNodeNeighborhood = (node: go.Node) => {
      clearHighlights();
      node.isHighlighted = true;
      node.findLinksConnected().each((link) => {
        link.isHighlighted = true;
        const other = link.getOtherNode(node);
        if (other) other.isHighlighted = true;
      });
    };

    const highlightLinkContext = (link: go.Link) => {
      clearHighlights();
      link.isHighlighted = true;
      if (link.fromNode) link.fromNode.isHighlighted = true;
      if (link.toNode) link.toNode.isHighlighted = true;
    };

    const restoreSelectionHighlight = () => {
      const selected = diagram.selection.first();
      if (selected instanceof go.Node) {
        highlightNodeNeighborhood(selected);
        return;
      }
      if (selected instanceof go.Link) {
        highlightLinkContext(selected);
        return;
      }
      clearHighlights();
    };

    diagram.addDiagramListener("ChangedSelection", restoreSelectionHighlight);
    diagram.addDiagramListener("SelectionMoved", restoreSelectionHighlight);
    diagram.addDiagramListener("BackgroundSingleClicked", clearHighlights);

    // Node template
    diagram.nodeTemplate = $(
      go.Node, "Auto",
      {
        movable: true,
        cursor: "grab",
        click: (_e: go.InputEvent, node: go.GraphObject) => {
          if (node instanceof go.Node) highlightNodeNeighborhood(node);
        },
        mouseEnter: (_e: go.InputEvent, node: go.GraphObject) => {
          if (node instanceof go.Node) highlightNodeNeighborhood(node);
        },
        mouseLeave: () => {
          restoreSelectionHighlight();
        },
      },
      $(go.Shape, "RoundedRectangle", {
        fill: "#1a1d27",
        stroke: "#2e3250",
        strokeWidth: 1.5,
        parameter1: 8,
      },
        new go.Binding("fill", "isHighlighted", (isHighlighted: boolean) =>
          isHighlighted ? "#233055" : "#1a1d27"
        ).ofObject(),
        new go.Binding("stroke", "isHighlighted", (isHighlighted: boolean) =>
          isHighlighted ? "#818cf8" : "#2e3250"
        ).ofObject()
      ),
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
            $(go.Shape, {
              figure: "LineH",
              stroke: "transparent",
              desiredSize: new go.Size(6, 1),
            }),
            $("PanelExpanderButton", "COLUMNS", {
              alignment: go.Spot.Right,
              width: 18,
              height: 18,
              cursor: "pointer",
            }),
          )
        ),
        // Columns
        $(go.Panel, "Vertical", {
          name: "COLUMNS",
          visible: true,
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
      {
        routing: go.Link.AvoidsNodes,
        corner: 10,
        click: (_e: go.InputEvent, link: go.GraphObject) => {
          if (link instanceof go.Link) highlightLinkContext(link);
        },
        mouseEnter: (_e: go.InputEvent, link: go.GraphObject) => {
          if (link instanceof go.Link) highlightLinkContext(link);
        },
        mouseLeave: () => {
          restoreSelectionHighlight();
        },
      },
      $(go.Shape,
        { stroke: "#4f5a8a", strokeWidth: 1.5, strokeDashArray: [5, 3] },
        new go.Binding("stroke", "isHighlighted", (isHighlighted: boolean) =>
          isHighlighted ? "#34d399" : "#4f5a8a"
        ).ofObject(),
        new go.Binding("strokeWidth", "isHighlighted", (isHighlighted: boolean) =>
          isHighlighted ? 2.5 : 1.5
        ).ofObject()
      ),
      $(go.Shape,
        { toArrow: "OpenTriangle", stroke: "#4f5a8a", strokeWidth: 1.5, fill: "transparent" },
        new go.Binding("stroke", "isHighlighted", (isHighlighted: boolean) =>
          isHighlighted ? "#34d399" : "#4f5a8a"
        ).ofObject()
      ),
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
