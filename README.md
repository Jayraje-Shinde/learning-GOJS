# gojs-data-dictionary

> Learning and implementing interactive ER diagrams and data dictionary visualizations using **GoJS** with a **React + TypeScript + Vite** stack.

---

## 🎯 Purpose

This repository is a hands-on learning ground for building a **data dictionary frontend** — a tool that visualizes database schemas as interactive, draggable ER diagrams. The end goal is to integrate this with a real backend that serves table metadata, relationships, and column definitions.

The project is being built incrementally:
- understand GoJS core concepts (Diagram, Model, Templates)
- render basic nodes and links
- build styled table nodes with column rows
- draw FK/PK relationships as ER links
- wire up real backend data when the API is ready

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite |
| Diagramming | GoJS 3.x |
| Styling | CSS / Tailwind (planned) |

---

## 📁 Project Structure

```
src/
├── components/       # GoJS diagram components
├── types/            # TypeScript interfaces (TableNode, Column, Relationship)
├── data/             # Mock data simulating backend API responses
├── hooks/            # Custom hooks (e.g. useDiagram)
├── App.tsx
└── main.tsx
```

---

## 🚀 Getting Started

```bash
# clone the repo
git clone https://github.com/Jayraje-Shinde/gojs-data-dictionary.git
cd gojs-data-dictionary

# install dependencies
npm install

# start dev server
npm run dev
```

Requires **Node.js 18+**.

---

## 📚 GoJS Concepts Covered

Progress is tracked as concepts are implemented:

- [ ] Diagram setup and div binding
- [ ] `GraphLinksModel` with nodes and links
- [ ] Custom node templates
- [ ] Column-level item templates inside nodes
- [ ] FK / PK visual badges
- [ ] Link routing and relationship labels
- [ ] Drag-to-reposition nodes
- [ ] Zoom and pan controls
- [ ] Selection and highlight states
- [ ] Feeding live backend data into the model

---

## 🔌 Backend Integration (Planned)

The backend will expose REST endpoints that return table schemas and relationships. The expected payload shape is already typed in `src/types/index.ts`:

```ts
interface DataDictionaryPayload {
  tables: TableNode[];
  relationships: Relationship[];
}
```

Once routes are available, `mockData.ts` will be swapped out for a real `fetch()` call — no other changes needed.

---

## 🗺 Roadmap

- [x] Project scaffold (Vite + React + TS)
- [x] GoJS installed and verified
- [ ] First diagram render (two nodes, one link)
- [ ] Styled table node template
- [ ] ER diagram with mock e-commerce schema
- [ ] Search / filter tables panel
- [ ] Backend API integration
- [ ] Export diagram as PNG / SVG

---

## 📄 License

MIT