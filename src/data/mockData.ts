export const mockTables = [
  {
    name: "olist_orders",
    schema: "olist",
    rowCount: 99441,
    summary: "Central fact table tracking the full lifecycle of every customer order — from purchase through delivery. Acts as the hub connecting customers, payments, reviews, and items.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["order_id"] },
      { type: "FOREIGN KEY", columns: ["customer_id"], references: "olist_customers(customer_id)" },
      { type: "CHECK", columns: ["order_status"], definition: "order_status IN ('created','approved','invoiced','processing','shipped','delivered','canceled','unavailable')" },
    ],
    columns: [
      { name: "order_id", type: "VARCHAR(32)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "customer_id", type: "VARCHAR(32)", isPK: false, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "order_status", type: "VARCHAR(20)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: "created" },
      { name: "order_purchase_timestamp", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: "NOW()" },
      { name: "order_approved_at", type: "TIMESTAMP", isPK: false, isFK: false, nullable: true, completeness: 97.8, required: false, defaultValue: null },
      { name: "order_delivered_carrier_date", type: "TIMESTAMP", isPK: false, isFK: false, nullable: true, completeness: 93.1, required: false, defaultValue: null },
      { name: "order_delivered_customer_date", type: "TIMESTAMP", isPK: false, isFK: false, nullable: true, completeness: 91.4, required: false, defaultValue: null },
      { name: "order_estimated_delivery_date", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
  {
    name: "olist_order_items",
    schema: "olist",
    rowCount: 112650,
    summary: "Line-item fact table representing individual products within an order. One order can have multiple items. Captures pricing and freight at the time of purchase.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["order_id", "order_item_id"] },
      { type: "FOREIGN KEY", columns: ["order_id"], references: "olist_orders(order_id)" },
      { type: "FOREIGN KEY", columns: ["product_id"], references: "olist_products(product_id)" },
      { type: "FOREIGN KEY", columns: ["seller_id"], references: "olist_sellers(seller_id)" },
      { type: "CHECK", columns: ["price"], definition: "price > 0" },
      { type: "CHECK", columns: ["freight_value"], definition: "freight_value >= 0" },
    ],
    columns: [
      { name: "order_id", type: "VARCHAR(32)", isPK: true, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "order_item_id", type: "INTEGER", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "product_id", type: "VARCHAR(32)", isPK: false, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "seller_id", type: "VARCHAR(32)", isPK: false, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "shipping_limit_date", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "price", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "freight_value", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: "0.00" },
    ],
  },
  {
    name: "olist_customers",
    schema: "olist",
    rowCount: 99441,
    summary: "Stores customer identity and location data. Each row is a unique order-customer pair — a single real customer may appear multiple times with different customer_ids but shares a customer_unique_id.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["customer_id"] },
      { type: "UNIQUE", columns: ["customer_unique_id"] },
    ],
    columns: [
      { name: "customer_id", type: "VARCHAR(32)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "customer_unique_id", type: "VARCHAR(32)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "customer_zip_code_prefix", type: "VARCHAR(10)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "customer_city", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "customer_state", type: "CHAR(2)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
  {
    name: "olist_products",
    schema: "olist",
    rowCount: 32951,
    summary: "Product catalog table. Contains physical dimensions and category metadata for each product listed by sellers. Dimension fields are critical for freight calculation.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["product_id"] },
      { type: "FOREIGN KEY", columns: ["product_category_name"], references: "product_category_translation(product_category_name)" },
    ],
    columns: [
      { name: "product_id", type: "VARCHAR(32)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "product_category_name", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: true, completeness: 98.6, required: false, defaultValue: null },
      { name: "product_name_lenght", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 98.6, required: false, defaultValue: null },
      { name: "product_description_lenght", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 98.6, required: false, defaultValue: null },
      { name: "product_photos_qty", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 98.6, required: false, defaultValue: "1" },
      { name: "product_weight_g", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 99.7, required: false, defaultValue: null },
      { name: "product_length_cm", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 99.7, required: false, defaultValue: null },
      { name: "product_height_cm", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 99.7, required: false, defaultValue: null },
      { name: "product_width_cm", type: "INTEGER", isPK: false, isFK: false, nullable: true, completeness: 99.7, required: false, defaultValue: null },
    ],
  },
  {
    name: "olist_sellers",
    schema: "olist",
    rowCount: 3095,
    summary: "Registry of all sellers operating on the Olist marketplace. Stores location data used for logistics and regional performance analysis.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["seller_id"] },
    ],
    columns: [
      { name: "seller_id", type: "VARCHAR(32)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "seller_zip_code_prefix", type: "VARCHAR(10)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "seller_city", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "seller_state", type: "CHAR(2)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
  {
    name: "olist_order_payments",
    schema: "olist",
    rowCount: 103886,
    summary: "Captures payment transactions per order. Supports split payments — one order can have multiple payment rows with different methods (credit card + voucher etc.).",
    constraints: [
      { type: "FOREIGN KEY", columns: ["order_id"], references: "olist_orders(order_id)" },
      { type: "CHECK", columns: ["payment_installments"], definition: "payment_installments >= 1" },
      { type: "CHECK", columns: ["payment_value"], definition: "payment_value >= 0" },
    ],
    columns: [
      { name: "order_id", type: "VARCHAR(32)", isPK: false, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "payment_sequential", type: "INTEGER", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "payment_type", type: "VARCHAR(20)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "payment_installments", type: "INTEGER", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: "1" },
      { name: "payment_value", type: "DECIMAL(10,2)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
  {
    name: "olist_order_reviews",
    schema: "olist",
    rowCount: 99224,
    summary: "Post-delivery customer satisfaction data. Review score is always present but free-text fields (title, message) are mostly empty — only ~41% of customers leave a written comment.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["review_id"] },
      { type: "FOREIGN KEY", columns: ["order_id"], references: "olist_orders(order_id)" },
      { type: "CHECK", columns: ["review_score"], definition: "review_score BETWEEN 1 AND 5" },
    ],
    columns: [
      { name: "review_id", type: "VARCHAR(32)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "order_id", type: "VARCHAR(32)", isPK: false, isFK: true, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "review_score", type: "SMALLINT", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "review_comment_title", type: "TEXT", isPK: false, isFK: false, nullable: true, completeness: 12.1, required: false, defaultValue: null },
      { name: "review_comment_message", type: "TEXT", isPK: false, isFK: false, nullable: true, completeness: 41.3, required: false, defaultValue: null },
      { name: "review_creation_date", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: "NOW()" },
      { name: "review_answer_timestamp", type: "TIMESTAMP", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
  {
    name: "product_category_translation",
    schema: "olist",
    rowCount: 71,
    summary: "Small lookup/reference table mapping Portuguese product category names to their English equivalents. Used for internationalization of the product catalog.",
    constraints: [
      { type: "PRIMARY KEY", columns: ["product_category_name"] },
      { type: "UNIQUE", columns: ["product_category_name_english"] },
    ],
    columns: [
      { name: "product_category_name", type: "VARCHAR(100)", isPK: true, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
      { name: "product_category_name_english", type: "VARCHAR(100)", isPK: false, isFK: false, nullable: false, completeness: 100, required: true, defaultValue: null },
    ],
  },
];

export const mockRelationships = [
  { from: "olist_orders",        to: "olist_customers",             fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_order_items",   to: "olist_orders",                fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_order_items",   to: "olist_products",              fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_order_items",   to: "olist_sellers",               fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_order_payments",to: "olist_orders",                fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_order_reviews", to: "olist_orders",                fromLabel: "N", toLabel: "1", type: "many-to-one" },
  { from: "olist_products",      to: "product_category_translation",fromLabel: "N", toLabel: "1", type: "many-to-one" },
];

export const mockAISummary = {
  title: "Brazilian E-Commerce Database — Olist",
  overview:
    "This database captures the full lifecycle of e-commerce transactions on the Olist marketplace in Brazil, covering 100K+ orders from 2016 to 2018. The schema models customers, sellers, products, payments, logistics, and post-purchase reviews across a multi-seller marketplace architecture.",
  insights: [
    "Orders table is the central fact table with 99K records, linking customers, payments, reviews and items.",
    "Review comments have very low fill rates — titles at 12.1% and messages at 41.3% — indicating most buyers leave score-only reviews.",
    "order_items is the largest join table with 112K rows, connecting orders, products, and sellers in a single fact.",
    "Delivery timestamps have ~8% null rate, likely reflecting cancelled or undelivered orders in the pipeline.",
    "product_category_translation acts as a small lookup table (71 rows) bridging Portuguese category names to English.",
    "Financial columns across payments and order_items maintain near-perfect completeness (99–100%).",
  ],
  dataHealth: 91,
  totalTables: 8,
  totalRelationships: 7,
  totalRows: "~610K",
};

export const mockChatBot = {
  suggestions: [
    "Where should we focus first to improve product conversion data quality?",
    "How complete is our order revenue data and can finance trust it?",
    "What table is the biggest performance risk for analytics workloads?",
    "Can we safely analyze repeat purchase behavior with this schema?",
    "How reliable is category-based merchandising analysis right now?",
  ],
  responses: {
    "Where should we focus first to improve product conversion data quality?": "Start with public.products.description. It is only 61.3% complete, so 38.7% of product records are missing descriptions. With 5,420 products total, this is the largest customer-facing content gap and the highest-impact quality fix for merchandising and conversion analysis.",
    "How complete is our order revenue data and can finance trust it?": "Revenue fields are strong. public.orders.total_amount is 99.1% complete across 312,874 orders, and public.order_items.unit_price is 99.8% complete across 1,042,300 line items. Finance can use this for trend reporting, but should still monitor the small missing-rate tail.",
    "What table is the biggest performance risk for analytics workloads?": "public.order_items is the main scale hotspot with 1,042,300 rows, much larger than orders (312,874) and users (84,231). For business dashboards, optimize joins from order_items to orders and products first because that path drives most transaction-level queries.",
    "Can we safely analyze repeat purchase behavior with this schema?": "Yes. The relationship chain users -> orders -> order_items is structurally complete for core keys: orders.user_id is 100% complete, and order_items.order_id plus order_items.product_id are both 100% complete. That supports robust repeat purchase and cohort analysis.",
    "How reliable is category-based merchandising analysis right now?": "Category assignment is mostly reliable: public.products.category_id is 94.7% complete across 5,420 products. Category hierarchy depth may be uneven because public.categories.parent_id is 43.0% complete across 128 categories, so rollups can be incomplete for nested taxonomy views.",
  } as Record<string, string>,
};