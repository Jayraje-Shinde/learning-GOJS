import { useEffect, useRef } from "react";
import * as go from "gojs";

export default function App() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    // 1. Create the diagram (attaches to the div)
    const diagram = new go.Diagram(divRef.current);

    // 2. Define the data (nodes + links)
    diagram.model = new go.GraphLinksModel(
      // nodes
      [
        { key: "users" },
        { key: "orders" },
      ],
      // links
      [
        { from: "users", to: "orders" }
      ]
    );

    return () => { diagram.div = null; }; // cleanup
  }, []);

  return <div ref={divRef} style={{ width: "100vw", height: "100vh" }} />;
}