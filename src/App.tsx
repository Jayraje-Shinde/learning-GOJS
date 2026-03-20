import { useEffect, useRef } from "react";
import * as go from "gojs";

export default function App() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, divRef.current, {
      "undoManager.isEnabled": true
    });

    // ── Node Template ──────────────────────────
    diagram.nodeTemplate = $(
      go.Node, "Auto",

      $(go.Shape, "RoundedRectangle", {
        fill: "#1a1d27",
        stroke: "#2e3250",
        strokeWidth: 1.5,
      }),

      $(go.Panel, "Vertical",
        { defaultAlignment: go.Spot.Left },

        // Header
        $(go.TextBlock, {
          font: "bold 13px monospace",
          stroke: "#ffffff",
          margin: new go.Margin(10, 14, 10, 14),
        },
          new go.Binding("text", "key")
        ),

        // Columns
        $(go.Panel, "Vertical",
          {
            defaultAlignment: go.Spot.Left,
            itemTemplate: $(
              go.Panel, "Horizontal",
              { padding: new go.Margin(4, 14, 4, 14) },
              $(go.TextBlock, {
                font: "12px monospace",
                stroke: "#e2e8f0",
                minSize: new go.Size(100, 0),
              },
                new go.Binding("text", "name")
              ),
              $(go.TextBlock, {
                font: "11px monospace",
                stroke: "#818cf8",
              },
                new go.Binding("text", "type")
              )
            ),
          },
          new go.Binding("itemArray", "columns")
        )
      )
    );

	 //---- Links ---------------------------------

	diagram.linkTemplate = $(
  go.Link,
  {
    routing: go.Link.AvoidsNodes,
    corner: 10,
    curve: go.Link.JumpOver,
  },

  // The line
  $(go.Shape, {
    stroke: "#818cf8",
    strokeWidth: 2,
    strokeDashArray: [6, 3],
  }),

  // Arrow at target end
  $(go.Shape, {
    toArrow: "OpenTriangle",
    stroke: "#818cf8",
    strokeWidth: 2,
    fill: "transparent",
  }),

  // Label at the FROM end
  $(go.TextBlock, {
    segmentIndex: 0,          // 0 = start of link
    segmentFraction: 0.1,     // how far along — 0.1 = near the start
    font: "bold 12px monospace",
    stroke: "#34d399",
    background: "#0f1117",    // bg so it doesn't overlap the line
    margin: new go.Margin(0, 4),
  },
    new go.Binding("text", "fromLabel")  // reads "fromLabel" from link data
  ),

  // Label at the TO end
// Label at the FROM end
$(go.TextBlock, {
  segmentIndex: 0,
  segmentFraction: 0.1,
  isMultiline: false,
  editable: false,
  font: "bold 12px monospace",
  stroke: "#34d399",
  background: "#0f1117",
  margin: new go.Margin(0, 4),
},
  new go.Binding("text", "fromLabel")
),

// Label at the TO end
$(go.TextBlock, {
  segmentIndex: -1,
  segmentFraction: 0.9,
  isMultiline: false,
  editable: false,
  font: "bold 12px monospace",
  stroke: "#34d399",
  background: "#0f1117",
  margin: new go.Margin(0, 4),
},
  new go.Binding("text", "toLabel")
),
);

    // ── Data ───────────────────────────────────
  diagram.model = new go.GraphLinksModel(
  [
    {
  key: "users",
  columns: [
    { name: "id",    type: "UUID" },
    { name: "email", type: "VARCHAR" },
  ]
},
    {
      key: "orders",
      columns: [
        { name: "id",       type: "UUID" },
        { name: "user_id",  type: "UUID" },
      ]
    },
  ],
  [
     {
    from: "users",
    to: "orders",
    fromLabel: "1",         // one user
    toLabel: "N",           // many orders
    type: "one-to-many"
  }
  ]
);

    return () => { diagram.div = null; };
  }, []);

 return (
  <div
    ref={divRef}
    style={{ width: "100vw", height: "100vh", background: "#0f1117" }}
  />
);
}