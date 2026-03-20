export const mockTables = [
  {
    name: "users",
    schema: "public",
    rowCount: 84231,
    columns: [
      { name: "id", type: "UUID", isPK: true, isFK: false, nullable: false, completeness: 100 },
      { name: "email", type: "VARCHAR(255)", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "username", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: false, completeness: 98.4 },
      { name: "created_at", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "updated_at", type: "TIMESTAMP", isPK: false, isFK: false, nullable: true, completeness: 76.2 },
    ],
  },
  {
    name: "orders",
    schema: "public",
    rowCount: 312874,
    columns: [
      { name: "id", type: "UUID", isPK: true, isFK: false, nullable: false, completeness: 100 },
      { name: "user_id", type: "UUID", isPK: false, isFK: true, nullable: false, completeness: 100 },
      { name: "status", type: "ENUM", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "total_amount", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 99.1 },
      { name: "created_at", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100 },
    ],
  },
  {
    name: "products",
    schema: "public",
    rowCount: 5420,
    columns: [
      { name: "id", type: "UUID", isPK: true, isFK: false, nullable: false, completeness: 100 },
      { name: "name", type: "VARCHAR(255)", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "description", type: "TEXT", isPK: false, isFK: false, nullable: true, completeness: 61.3 },
      { name: "price", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "category_id", type: "UUID", isPK: false, isFK: true, nullable: false, completeness: 94.7 },
    ],
  },
  {
    name: "order_items",
    schema: "public",
    rowCount: 1042300,
    columns: [
      { name: "id", type: "UUID", isPK: true, isFK: false, nullable: false, completeness: 100 },
      { name: "order_id", type: "UUID", isPK: false, isFK: true, nullable: false, completeness: 100 },
      { name: "product_id", type: "UUID", isPK: false, isFK: true, nullable: false, completeness: 100 },
      { name: "quantity", type: "INTEGER", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "unit_price", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 99.8 },
    ],
  },
  {
    name: "categories",
    schema: "public",
    rowCount: 128,
    columns: [
      { name: "id", type: "UUID", isPK: true, isFK: false, nullable: false, completeness: 100 },
      { name: "name", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: false, completeness: 100 },
      { name: "parent_id", type: "UUID", isPK: false, isFK: true, nullable: true, completeness: 43.0 },
    ],
  },
];

export const mockRelationships = [
  { from: "orders", to: "users", fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "order_items", to: "orders", fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "order_items", to: "products", fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "products", to: "categories", fromLabel: "N", toLabel: "1", type: "many-to-one" },
];

export const mockAISummary = {
  title: "E-Commerce Transaction Database",
  overview:
    "This database powers a mid-scale e-commerce platform managing users, product catalog, and order lifecycle. The schema follows a normalized 3NF structure with clear separation between customer identity, product inventory, and transactional records.",
  insights: [
    "Orders table is the central fact table with 312K+ records linked to users and products.",
    "Product descriptions have 38.7% null rate — likely incomplete catalog entries needing attention.",
    "Category hierarchy supports nested subcategories via self-referencing parent_id.",
    "High completeness (99%+) on financial columns indicates strong data pipeline integrity.",
  ],
  dataHealth: 87,
  totalTables: 5,
  totalRelationships: 4,
  totalRows: "1.4M+",
};
