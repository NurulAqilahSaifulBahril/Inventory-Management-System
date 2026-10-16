// Figures taken from the ESAJ inverter stock book (current stock, pending
// install, outstanding order). To-order quantity is
// pending install − current stock − outstanding order, when that is above zero.
// Panel and battery have no matching on-hand total in the sample sheets.

export type WarehouseNoticeKind = "order" | "stockIn" | "faulty" | "install";

export type WarehouseNotice = {
  id: string;
  kind: WarehouseNoticeKind;
  warehouse: "JB" | "KL";
  // "now", "2h", or the install date for install notices.
  time: string;
  // Quantity × model, or the customer and kit for install notices.
  title: string;
  // Panel, Inverter, Battery or Other. Left out when the title already lists the kit.
  category?: string;
  // What is happening and what to do next.
  detail: string;
};

export type WarehouseCustomer = {
  name: string;
  qty: number;
  cover: "On hand" | "Short";
};

export type WarehouseModel = {
  id: string;
  code: string;
  inverterType: "string" | "hybrid" | "micro";
  onHand: number;
  pending: number;
  onOrder: number;
  orderQty: number;
  customers: WarehouseCustomer[];
};

export type StockCard = {
  id: "inverter" | "panel" | "battery";
  label: string;
  onHand: number | null;
  toInstall: number | null;
  toBuy: number | null;
};

export type SystemTrend = {
  month: string;
  sales: number;
  install: number;
  target: number;
};

// Sample notices for the sign-in screen. All dummy: one of each kind per warehouse.
export const WAREHOUSE_NOTICES: WarehouseNotice[] = [
  {
    id: "order-r5-7",
    kind: "order",
    warehouse: "JB",
    time: "now",
    title: "20 × R5-7K-S2",
    category: "Inverter",
    detail: "2 left, 22 to install. Order by 30 Sep.",
  },
  {
    id: "stockin-jkm650",
    kind: "stockIn",
    warehouse: "KL",
    time: "1h",
    title: "300 × Jinko 650W",
    category: "Panel",
    detail: "Received from supplier. KL now has 355.",
  },
  {
    id: "faulty-h2-8k",
    kind: "faulty",
    warehouse: "JB",
    time: "3h",
    title: "2 × H2-8K-LT2",
    category: "Inverter",
    detail: "Won't power on. Return to supplier (RMA).",
  },
  {
    id: "install-tan",
    kind: "install",
    warehouse: "KL",
    time: "29 Sep",
    title: "Tan Residence: 14 panels, 1 inverter",
    detail: "Jinko 620W + H2-10K-LT2. All in stock ✓",
  },
  {
    id: "order-jkm620",
    kind: "order",
    warehouse: "KL",
    time: "2h",
    title: "120 × Jinko 620W",
    category: "Panel",
    detail: "40 left, 160 booked for October.",
  },
  {
    id: "stockin-b3-16",
    kind: "stockIn",
    warehouse: "JB",
    time: "today",
    title: "10 × B3-16.0-LV",
    category: "Battery",
    detail: "Delivery DO-2291 checked and shelved.",
  },
  {
    id: "faulty-astr625",
    kind: "faulty",
    warehouse: "KL",
    time: "yesterday",
    title: "4 × Astronergy 625W",
    category: "Panel",
    detail: "Cracked glass found on unloading.",
  },
  {
    id: "install-lim",
    kind: "install",
    warehouse: "JB",
    time: "1 Oct",
    title: "Lim Enterprise: 1 × ATS Three Phase",
    category: "Other",
    detail: "Short 1. Transfer from KL.",
  },
];

// Dummy totals: the sum of the inverter types below, Hybrid included.
export const INVERTER_ON_HAND = 442;
export const INVERTER_PENDING = 365;
export const INVERTER_TO_BUY = 48;

export type InverterTypeId = "string" | "hybrid" | "micro";

export const INVERTER_TYPES: Array<{
  id: InverterTypeId;
  label: string;
  onHand: number | null;
  toInstall: number | null;
  toBuy: number | null;
}> = [
  { id: "string", label: "String", onHand: 245, toInstall: 288, toBuy: 39 },
  { id: "hybrid", label: "Hybrid", onHand: 60, toInstall: 45, toBuy: 0 }, // dummy
  { id: "micro", label: "Micro", onHand: 137, toInstall: 32, toBuy: 9 },
];

export const STOCK_CARDS: StockCard[] = [
  { id: "inverter", label: "Inverter", onHand: INVERTER_ON_HAND, toInstall: INVERTER_PENDING, toBuy: INVERTER_TO_BUY },
  { id: "panel", label: "Panel", onHand: 1850, toInstall: 1420, toBuy: 120 }, // dummy
  { id: "battery", label: "Battery", onHand: 143, toInstall: 118, toBuy: 15 }, // dummy; on hand matches the battery table (95 JB + 48 KL)
];

// Draft monthly counts for the landing chart. Systems, not ringgit.
// Replace with a full count from Post Sales once that sheet is totaled.
export const SYSTEM_TREND: SystemTrend[] = [
  { month: "May", sales: 22, install: 14, target: 25 },
  { month: "Jun", sales: 26, install: 18, target: 25 },
  { month: "Jul", sales: 19, install: 21, target: 25 },
  { month: "Aug", sales: 31, install: 17, target: 30 },
  { month: "Sep", sales: 28, install: 12, target: 30 },
];

// Customer names are the first rows on the R5-7K-S2 column. The sheet's
// pending total is 22, so this is not the full list.
export const ORDER_MODELS: WarehouseModel[] = [
  {
    id: "r5-7",
    code: "R5-7K-S2",
    inverterType: "string",
    onHand: 2,
    pending: 22,
    onOrder: 0,
    orderQty: 20,
    customers: [
      { name: "Lok Suet Lee", qty: 1, cover: "On hand" },
      { name: "Lim Kok Siang", qty: 1, cover: "On hand" },
      { name: "Chee Chin Fou", qty: 1, cover: "Short" },
      { name: "Woo Pek Lai", qty: 1, cover: "Short" },
    ],
  },
  {
    id: "m2",
    code: "M2-1.8K-S4",
    inverterType: "micro",
    onHand: 14,
    pending: 23,
    onOrder: 0,
    orderQty: 9,
    customers: [],
  },
  {
    id: "r5-6",
    code: "R5-6K-S2",
    inverterType: "string",
    onHand: 4,
    pending: 12,
    onOrder: 0,
    orderQty: 8,
    customers: [],
  },
  {
    id: "r6-8",
    code: "R6-8K-T2",
    inverterType: "string",
    onHand: 3,
    pending: 41,
    onOrder: 30,
    orderQty: 8,
    customers: [],
  },
  {
    id: "c6",
    code: "C6-100K-T9",
    inverterType: "string",
    onHand: 2,
    pending: 6,
    onOrder: 2,
    orderQty: 2,
    customers: [],
  },
  {
    id: "r6-20",
    code: "R6-20K-T2-32",
    inverterType: "string",
    onHand: 3,
    pending: 9,
    onOrder: 5,
    orderQty: 1,
    customers: [],
  },
];

// ── Stock Details page data ────────────────────────────────────────────

export type WarehouseStockSummary = {
  warehouse: string;
  panels: number;
  inverters: number;
  batteries: number;
};

export type StockModelTrendPoint = {
  month: string;
  panels: number;
  inverters: number;
  batteries: number;
};

export type StockDetailItem = {
  id: string;
  category: "panel" | "inverter" | "battery" | "other";
  // Sub-heading inside a table, e.g. "ATS" or "EV Charger".
  group?: string;
  model: string;
  serialCode: string;
  warehouse: "JB" | "KL";
  qty: number;
  highlight?: boolean;
};

// Current stock totals by warehouse. Panel and battery totals are
// estimates — the source sheet only has a full count for inverters.
export const WAREHOUSE_STOCK_SUMMARY: WarehouseStockSummary[] = [
  { warehouse: "JB", panels: 450, inverters: 245, batteries: 95 },
  { warehouse: "KL", panels: 320, inverters: 197, batteries: 48 },
];

// End-of-month stock levels across all warehouses. Gives a sense
// of whether inventory is building or depleting.
export const STOCK_MODEL_TREND: StockModelTrendPoint[] = [
  { month: "May", panels: 620, inverters: 340, batteries: 110 },
  { month: "Jun", panels: 580, inverters: 360, batteries: 125 },
  { month: "Jul", panels: 710, inverters: 390, batteries: 130 },
  { month: "Aug", panels: 800, inverters: 410, batteries: 150 },
  { month: "Sep", panels: 770, inverters: 442, batteries: 143 },
];

// ── Stock Balance & Transaction Log ────────────────────────────────────

export type CategoryStockBalance = {
  id: "inverter" | "panel" | "battery";
  label: string;
  onHand: number;
  toInstall: number;
  available: number;
  toBuy: number;
};

export const WAREHOUSE_BALANCES: Record<"all" | "JB" | "KL", CategoryStockBalance[]> = {
  all: [
    { id: "inverter", label: "Inverter", onHand: 442, toInstall: 365, available: 77, toBuy: 48 },
    { id: "panel", label: "Panel", onHand: 770, toInstall: 620, available: 150, toBuy: 0 },
    { id: "battery", label: "Battery", onHand: 143, toInstall: 118, available: 25, toBuy: 15 },
  ],
  JB: [
    { id: "inverter", label: "Inverter", onHand: 245, toInstall: 210, available: 35, toBuy: 30 },
    { id: "panel", label: "Panel", onHand: 450, toInstall: 380, available: 70, toBuy: 0 },
    { id: "battery", label: "Battery", onHand: 95, toInstall: 80, available: 15, toBuy: 10 },
  ],
  KL: [
    { id: "inverter", label: "Inverter", onHand: 197, toInstall: 155, available: 42, toBuy: 18 },
    { id: "panel", label: "Panel", onHand: 320, toInstall: 240, available: 80, toBuy: 0 },
    { id: "battery", label: "Battery", onHand: 48, toInstall: 38, available: 10, toBuy: 5 },
  ],
};

export type StockTransactionType = "in" | "out" | "transfer";

export type StockTransactionStatus = "To Verify" | "Inspected" | "Verified";

export type StockInInvoiceItem = {
  skuId: string;
  model: string;
  description: string;
  category: "panel" | "inverter" | "battery" | "other";
  invoicedQty: number;
  unit: string;
  barcode: string;
  palletBarcode?: string;
  palletQty?: number;
  sampleSerials?: string[];
  unitPrice?: string;
};

export type StockInInvoiceData = {
  invoiceNo: string;
  invoiceDate: string;
  expectedDelivery: string;
  poNumber: string;
  supplierName: string;
  items: StockInInvoiceItem[];
  palletCount?: number;
  unitPrice?: string;
  notes?: string;
  invoicedQty?: number;
  receivedQty?: number;
};

export type SupplierSerialUnit = {
  serialNo: string;
  palletNo: number;
  palletBarcode: string;
  skuId: string;
  model: string;
  flashPowerWatts?: number;
  vmp?: number;
  imp?: number;
};

export type StockOutScheduleData = {
  jobId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  scheduledDate: string;
  installerTeam: string;
  systemPackage?: string;
  allocatedQty: number;
  dispatchedQty: number;
  notes?: string;
  systemSizeKwp?: string;
  dcAcRatio?: string;
  systemPrice?: string;
  panelBrand?: string;
  noOfPanel?: number;
  panelPowerWatts?: number;
  inverterBrand?: string;
  inverterNo?: string;
  inverterSize?: string;
  totalInverterPower?: string;
  payment?: string;
  sedaStatus?: string;
  insuranceAppliedDate?: string;
  agentName?: string;
};

export type StockTransferData = {
  transferNo: string;
  fromWarehouse: "JB" | "KL";
  toWarehouse: "JB" | "KL";
  requestedBy: string;
  driverName?: string;
  vehiclePlate?: string;
  dispatchedDate?: string;
  receivedDate?: string;
  dispatchedQty: number;
  receivedQty: number;
  notes?: string;
};

export type StockTransaction = {
  id: string;
  time: string;
  type: StockTransactionType;
  category: "panel" | "inverter" | "battery" | "other";
  model: string;
  serialCode: string;
  qty: number;
  warehouse: "JB" | "KL";
  reference: string;
  party: string;
  status: StockTransactionStatus;
  issueRemark?: string;
  invoice?: StockInInvoiceData;
  schedule?: StockOutScheduleData;
  transfer?: StockTransferData;
};

export const STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: "tx-1",
    time: "Today, 10:30 AM",
    type: "in",
    category: "panel",
    model: "Jinko 620W",
    serialCode: "E4FXJ425G217507196124815",
    qty: 300,
    warehouse: "KL",
    reference: "DO-2026-9921",
    party: "Jinko Solar & SAJ Electric Dist.",
    status: "To Verify",
    invoice: {
      invoiceNo: "INV-2026-9921",
      invoiceDate: "16 Oct 2026",
      expectedDelivery: "16 Oct 2026, 10:30 AM (Today)",
      poNumber: "PO-MY-4412",
      supplierName: "Jinko Solar Technology Sdn Bhd / SAJ Electric Authorized Dist.",
      invoicedQty: 300,
      receivedQty: 300,
      palletCount: 10,
      unitPrice: "RM 395.00",
      notes: "Direct container delivery from Port Klang warehouse. Seal #8812. Detailed 300 serial numbers provided on attached Delivery Order (DO) packing sheet.",
      items: [
        {
          skuId: "JKM-620N-72HL4-BDV",
          model: "Jinko Tiger Neo 620W N-Type",
          description: "Bifacial Dual-Glass PV Modules (10 Pallets × 30 pcs per pallet)",
          category: "panel",
          invoicedQty: 300,
          unit: "pcs",
          barcode: "E4FXJ425G217507196124815",
          palletBarcode: "PAL-JKM-001",
          palletQty: 30,
          sampleSerials: [
            "E4FXJ425G217507196124815",
            "E4FXJ425G217507196124816",
            "E4FXJ425G217507196124817",
          ],
          unitPrice: "RM 395.00",
        },
      ],
    },
  },
  {
    id: "tx-2",
    time: "Today, 09:15 AM",
    type: "out",
    category: "inverter",
    model: "R5-7K-S2",
    serialCode: "HDT2103J2613ESA06996",
    qty: 1,
    warehouse: "JB",
    reference: "JOB #1042 · Tan Residence",
    party: "Installer Team Alpha",
    status: "To Verify",
    schedule: {
      jobId: "INS-1042",
      customerName: "Tan Residence (Mr. Tan Wei Ming)",
      customerPhone: "+60 12-788 1920",
      customerAddress: "No. 18, Jalan Indah 12, Bukit Indah, 79100 Iskandar Puteri, Johor",
      scheduledDate: "17 Oct 2026 (Tomorrow)",
      installerTeam: "Team Alpha (Lead: Azman)",
      systemPackage: "12.8 kWp Residential Solar System",
      allocatedQty: 1,
      dispatchedQty: 1,
      notes: "Pick up by installer van before 8:30 AM. Customer requested inverter test on site.",
      systemSizeKwp: "12.80",
      dcAcRatio: "1.28",
      systemPrice: "RM 38,500.00",
      panelBrand: "Jinko Tiger Neo",
      noOfPanel: 20,
      panelPowerWatts: 620,
      inverterBrand: "SAJ Electric",
      inverterNo: "1",
      inverterSize: "10.0 kW",
      totalInverterPower: "10.0 kW",
      payment: "100% Paid",
      sedaStatus: "Approved",
      insuranceAppliedDate: "11 Oct 2026",
      agentName: "DENISE NG PEI SING",
    },
  },
  {
    id: "tx-3",
    time: "Today, 08:45 AM",
    type: "out",
    category: "panel",
    model: "Jinko 620W",
    serialCode: "E4FXJ425G217507196111636",
    qty: 14,
    warehouse: "JB",
    reference: "JOB #1039 · Lok Suet Lee",
    party: "Installer Team Bravo",
    status: "To Verify",
    schedule: {
      jobId: "INS-1039",
      customerName: "Lok Suet Lee",
      customerPhone: "+60 16-332 9901",
      customerAddress: "No. 5, Jalan Molek 2/1, Taman Molek, 81100 Johor Bahru",
      scheduledDate: "16 Oct 2026 (Today)",
      installerTeam: "Team Bravo (Lead: Suresh)",
      systemPackage: "8.68 kWp Residential Solar System",
      allocatedQty: 14,
      dispatchedQty: 14,
      notes: "Scheduled for morning installation slot. Panels loaded on Team Bravo lorry.",
      systemSizeKwp: "8.68",
      dcAcRatio: "1.24",
      systemPrice: "RM 26,900.00",
      panelBrand: "Jinko Solar",
      noOfPanel: 14,
      panelPowerWatts: 620,
      inverterBrand: "SAJ Electric",
      inverterNo: "1",
      inverterSize: "7.0 kW",
      totalInverterPower: "7.0 kW",
      payment: "100% Paid",
      sedaStatus: "Approved",
      insuranceAppliedDate: "08 Oct 2026",
      agentName: "OLIVIER KOH CONG LEE",
    },
  },
  {
    id: "tx-4",
    time: "Yesterday, 04:20 PM",
    type: "in",
    category: "battery",
    model: "B3-16.0-LV",
    serialCode: "ESB3-160LV",
    qty: 10,
    warehouse: "JB",
    reference: "DO-2026-8840",
    party: "FoxESS Malaysia",
    status: "To Verify",
    invoice: {
      invoiceNo: "INV-FX-8840",
      invoiceDate: "15 Oct 2026",
      expectedDelivery: "15 Oct 2026, 04:00 PM (Yesterday)",
      poNumber: "PO-MY-4390",
      supplierName: "FoxESS Power (Malaysia) Sdn Bhd",
      invoicedQty: 10,
      receivedQty: 10,
      palletCount: 2,
      unitPrice: "RM 14,200.00",
      notes: "Heavy shipment. Shelved on Bay B-04. Firmware 2.1 pre-loaded.",
      items: [
        {
          skuId: "SKU-BAT-B3-16",
          model: "B3-16.0-LV",
          description: "FoxESS 16.0 kWh Low Voltage Storage Battery Pack",
          category: "battery",
          invoicedQty: 10,
          unit: "units",
          barcode: "ESB3-160LV",
          palletBarcode: "PLT-BAT-B3-02",
          palletQty: 5,
          sampleSerials: [
            "ESB3-160LV-SN01",
            "ESB3-160LV-SN02",
            "ESB3-160LV-SN03",
            "ESB3-160LV-SN04",
            "ESB3-160LV-SN05",
          ],
          unitPrice: "RM 14,200.00",
        },
      ],
    },
  },
  {
    id: "tx-5",
    time: "Yesterday, 02:00 PM",
    type: "transfer",
    category: "panel",
    model: "Astronergy 625W",
    serialCode: "E4FXJ425G217507196137402",
    qty: 4,
    warehouse: "KL",
    reference: "TR-2026-0041 · KL ➔ JB",
    party: "Warehouse Transfer",
    status: "Inspected",
    issueRemark: "1 unit packaging crushed in transport",
    transfer: {
      transferNo: "TR-2026-0041",
      fromWarehouse: "KL",
      toWarehouse: "JB",
      requestedBy: "Wei Hao (Ops Admin)",
      driverName: "Inter-Warehouse Lorry B (Driver: Ramesh)",
      vehiclePlate: "WXQ 8821",
      dispatchedDate: "15 Oct 2026, 02:00 PM",
      dispatchedQty: 4,
      receivedQty: 4,
      notes: "Inter-warehouse stock balancing for upcoming South Region commercial jobs.",
    },
  },
  {
    id: "tx-6",
    time: "Yesterday, 11:30 AM",
    type: "out",
    category: "inverter",
    model: "R6-8K-T2",
    serialCode: "HDT2103J2613ESA07270",
    qty: 1,
    warehouse: "KL",
    reference: "JOB #1035 · Woo Pek Lai",
    party: "Installer Team Delta",
    status: "Verified",
    schedule: {
      jobId: "INS-1035",
      customerName: "Woo Pek Lai",
      customerPhone: "+60 19-221 4488",
      customerAddress: "22, Jalan Kiara 3, Mont Kiara, 50480 Kuala Lumpur",
      scheduledDate: "15 Oct 2026 (Completed)",
      installerTeam: "Team Delta (Lead: Kevin)",
      systemPackage: "10 kWp Three-Phase Inverter Setup",
      allocatedQty: 1,
      dispatchedQty: 1,
      notes: "Verified by Wei Hao on dispatch. Installation completed successfully.",
    },
  },
  {
    id: "tx-7",
    time: "14 Oct, 03:50 PM",
    type: "in",
    category: "inverter",
    model: "M2-1.8K-S4",
    serialCode: "HDT2103J2613ESA07407",
    qty: 25,
    warehouse: "JB",
    reference: "DO-2026-7731",
    party: "Deye Tech Supplier",
    status: "To Verify",
    invoice: {
      invoiceNo: "INV-DEYE-7731",
      invoiceDate: "14 Oct 2026",
      expectedDelivery: "14 Oct 2026, 03:30 PM",
      poNumber: "PO-MY-4355",
      supplierName: "Deye Malaysia Official Dist.",
      invoicedQty: 25,
      receivedQty: 25,
      palletCount: 1,
      unitPrice: "RM 1,480.00",
      notes: "Microinverters boxed in master cartons of 5. Unopened and intact.",
      items: [
        {
          skuId: "SKU-INV-M2-18",
          model: "M2-1.8K-S4",
          description: "Deye 1.8kW Single Phase 4-MPPT Microinverter",
          category: "inverter",
          invoicedQty: 25,
          unit: "units",
          barcode: "HDT2103J2613ESA07407",
          palletBarcode: "CTN-DEYE-M2-BOX5",
          palletQty: 5,
          sampleSerials: [
            "HDT2103J2613ESA07407",
            "HDT2103J2613ESA07408",
            "HDT2103J2613ESA07409",
          ],
          unitPrice: "RM 1,480.00",
        },
      ],
    },
  },
  {
    id: "tx-8",
    time: "14 Oct, 01:10 PM",
    type: "out",
    category: "battery",
    model: "B3-5.0-LV",
    serialCode: "ESB3-50LV",
    qty: 2,
    warehouse: "JB",
    reference: "JOB #1031 · Raj Kumar",
    party: "Installer Team Alpha",
    status: "Verified",
    schedule: {
      jobId: "INS-1031",
      customerName: "Raj Kumar",
      customerPhone: "+60 17-662 1099",
      customerAddress: "45, Jalan Sutera 4, Taman Sutera Utama, 81300 Skudai, Johor",
      scheduledDate: "14 Oct 2026 (Completed)",
      installerTeam: "Team Alpha (Lead: Azman)",
      systemPackage: "5.0 kWh Modular Battery Expansion",
      allocatedQty: 2,
      dispatchedQty: 2,
      notes: "Customer signed handover receipt. System tested and commissioning verified.",
    },
  },
  {
    id: "tx-9",
    time: "13 Oct, 05:00 PM",
    type: "in",
    category: "other",
    model: "Single Phase ATS",
    serialCode: "ATS-1P",
    qty: 15,
    warehouse: "KL",
    reference: "DO-2026-6540",
    party: "Schneider Electric",
    status: "To Verify",
    invoice: {
      invoiceNo: "INV-SCH-6540",
      invoiceDate: "13 Oct 2026",
      expectedDelivery: "13 Oct 2026, 04:30 PM",
      poNumber: "PO-MY-4310",
      supplierName: "Schneider Electric Malaysia",
      invoicedQty: 15,
      receivedQty: 15,
      palletCount: 1,
      unitPrice: "RM 680.00",
      notes: "Automatic Transfer Switch units for backup battery configurations.",
      items: [
        {
          skuId: "SKU-ACC-ATS-1P",
          model: "Single Phase ATS",
          description: "Schneider 63A Single Phase Automatic Transfer Switch Unit",
          category: "other",
          invoicedQty: 15,
          unit: "units",
          barcode: "ATS-1P",
          palletBarcode: "CTN-ATS-1P-BOX",
          palletQty: 5,
          sampleSerials: ["ATS-1P-SN01", "ATS-1P-SN02", "ATS-1P-SN03"],
          unitPrice: "RM 680.00",
        },
      ],
    },
  },
  {
    id: "tx-10",
    time: "13 Oct, 10:15 AM",
    type: "out",
    category: "panel",
    model: "Jinko 650W",
    serialCode: "E4FXJ425G217507196124815",
    qty: 24,
    warehouse: "JB",
    reference: "JOB #1028 · Lee Chong Wei",
    party: "Installer Team Charlie",
    status: "To Verify",
    schedule: {
      jobId: "INS-1028",
      customerName: "Lee Chong Wei",
      customerPhone: "+60 12-555 8899",
      customerAddress: "88, Jalan Senai Utama, 81400 Senai, Johor",
      scheduledDate: "13 Oct 2026",
      installerTeam: "Team Charlie (Lead: Hafiz)",
      systemPackage: "15.6 kWp High Capacity Solar System",
      allocatedQty: 24,
      dispatchedQty: 24,
      notes: "Commercial rooftop install. Pallet unloaded onto transport flatbed.",
    },
  },
  {
    id: "tx-11",
    time: "Today, 11:30 AM",
    type: "transfer",
    category: "inverter",
    model: "M2-1.8K-S4",
    serialCode: "HDT2103J2613ESA07407",
    qty: 5,
    warehouse: "JB",
    reference: "TR-2026-0042 · JB ➔ KL",
    party: "Warehouse Transfer",
    status: "To Verify",
    transfer: {
      transferNo: "TR-2026-0042",
      fromWarehouse: "JB",
      toWarehouse: "KL",
      requestedBy: "Wei Hao (Ops Admin)",
      driverName: "Inter-City Transport Alpha (Driver: Muthu)",
      vehiclePlate: "JTP 4910",
      dispatchedDate: "16 Oct 2026, 11:30 AM",
      dispatchedQty: 5,
      receivedQty: 5,
      notes: "Urgent microinverter balancing for Central Region high-density residential installations.",
    },
  },
  {
    id: "tx-12",
    time: "Yesterday, 09:30 AM",
    type: "transfer",
    category: "panel",
    model: "Jinko 620W",
    serialCode: "E4FXJ425G217507196111636",
    qty: 10,
    warehouse: "JB",
    reference: "TR-2026-0043 · JB ➔ KL",
    party: "Warehouse Transfer",
    status: "Verified",
    transfer: {
      transferNo: "TR-2026-0043",
      fromWarehouse: "JB",
      toWarehouse: "KL",
      requestedBy: "Wei Hao (Ops Admin)",
      driverName: "Lorry Transport C (Driver: Azmi)",
      vehiclePlate: "JQU 3312",
      dispatchedDate: "15 Oct 2026, 09:30 AM",
      receivedDate: "15 Oct 2026, 03:00 PM",
      dispatchedQty: 10,
      receivedQty: 10,
      notes: "Verified on arrival at KL Warehouse by Ah Hock. Pallet and modules in pristine condition.",
    },
  },
  {
    id: "tx-13",
    time: "Today, 02:15 PM",
    type: "transfer",
    category: "battery",
    model: "B3-16.0-LV",
    serialCode: "ESB3-160LV",
    qty: 2,
    warehouse: "KL",
    reference: "TR-2026-0044 · KL ➔ JB",
    party: "Warehouse Transfer",
    status: "To Verify",
    transfer: {
      transferNo: "TR-2026-0044",
      fromWarehouse: "KL",
      toWarehouse: "JB",
      requestedBy: "Wei Hao (Ops Admin)",
      driverName: "Special Logistics Van (Driver: Ken)",
      vehiclePlate: "VDC 7790",
      dispatchedDate: "16 Oct 2026, 02:15 PM",
      dispatchedQty: 2,
      receivedQty: 2,
      notes: "Battery relocation for Johor Bahru high-capacity residential energy storage setup.",
    },
  },
];

// Individual stock items — each row is one model in one warehouse.
// Inverter qty totals match INVERTER_ON_HAND (442).
export const STOCK_DETAIL_ITEMS: StockDetailItem[] = [
  // ── Panels ── (dummy; highlighted rows are the priority models. Serials follow
  // the format of a real panel serial, E4FXJ425G217507196111636.)
  { id: "p1", category: "panel", model: "Jinko 620W", serialCode: "E4FXJ425G217507196111636", warehouse: "JB", qty: 90, highlight: true },
  { id: "p2", category: "panel", model: "Jinko 620W", serialCode: "E4FXJ425G217507196111636", warehouse: "KL", qty: 65, highlight: true },
  { id: "p3", category: "panel", model: "Jinko 650W", serialCode: "E4FXJ425G217507196124815", warehouse: "JB", qty: 80, highlight: true },
  { id: "p4", category: "panel", model: "Jinko 650W", serialCode: "E4FXJ425G217507196124815", warehouse: "KL", qty: 55, highlight: true },
  { id: "p5", category: "panel", model: "Astronergy 625W", serialCode: "E4FXJ425G217507196137402", warehouse: "JB", qty: 70, highlight: true },
  { id: "p6", category: "panel", model: "Astronergy 625W", serialCode: "E4FXJ425G217507196137402", warehouse: "KL", qty: 50, highlight: true },
  { id: "p7", category: "panel", model: "Jinko 575W", serialCode: "E4FXJ425G217507196140958", warehouse: "JB", qty: 60 },
  { id: "p8", category: "panel", model: "Jinko 575W", serialCode: "E4FXJ425G217507196140958", warehouse: "KL", qty: 45 },
  { id: "p9", category: "panel", model: "Jinko 585W", serialCode: "E4FXJ425G217507196152371", warehouse: "JB", qty: 55 },
  { id: "p10", category: "panel", model: "Jinko 585W", serialCode: "E4FXJ425G217507196152371", warehouse: "KL", qty: 40 },
  { id: "p11", category: "panel", model: "Astronergy 580W", serialCode: "E4FXJ425G217507196168024", warehouse: "JB", qty: 50 },
  { id: "p12", category: "panel", model: "Astronergy 580W", serialCode: "E4FXJ425G217507196168024", warehouse: "KL", qty: 35 },
  { id: "p13", category: "panel", model: "Jinko 590W", serialCode: "E4FXJ425G217507196179563", warehouse: "JB", qty: 45 },
  { id: "p14", category: "panel", model: "Jinko 590W", serialCode: "E4FXJ425G217507196179563", warehouse: "KL", qty: 30 },
  // ── Inverters ── (serials are dummy, in the format of a real inverter serial,
  // HDT2103J2613ESA06996.)
  { id: "i1", category: "inverter", model: "R5-7K-S2", serialCode: "HDT2103J2613ESA06996", warehouse: "JB", qty: 2 },
  { id: "i2", category: "inverter", model: "R5-6K-S2", serialCode: "HDT2103J2613ESA07133", warehouse: "JB", qty: 4 },
  { id: "i3", category: "inverter", model: "R5-6K-S2", serialCode: "HDT2103J2613ESA07133", warehouse: "KL", qty: 8 },
  { id: "i4", category: "inverter", model: "R6-8K-T2", serialCode: "HDT2103J2613ESA07270", warehouse: "JB", qty: 3 },
  { id: "i5", category: "inverter", model: "R6-8K-T2", serialCode: "HDT2103J2613ESA07270", warehouse: "KL", qty: 6 },
  { id: "i6", category: "inverter", model: "M2-1.8K-S4", serialCode: "HDT2103J2613ESA07407", warehouse: "JB", qty: 80 },
  { id: "i7", category: "inverter", model: "M2-1.8K-S4", serialCode: "HDT2103J2613ESA07407", warehouse: "KL", qty: 57 },
  { id: "i8", category: "inverter", model: "C6-100K-T9", serialCode: "HDT2103J2613ESA07544", warehouse: "JB", qty: 2 },
  { id: "i9", category: "inverter", model: "R6-20K-T2-32", serialCode: "HDT2103J2613ESA07681", warehouse: "JB", qty: 3 },
  { id: "i10", category: "inverter", model: "R6-20K-T2-32", serialCode: "HDT2103J2613ESA07681", warehouse: "KL", qty: 2 },
  { id: "i11", category: "inverter", model: "R6-15K-T2-32", serialCode: "HDT2103J2613ESA07818", warehouse: "JB", qty: 15 },
  { id: "i12", category: "inverter", model: "R6-15K-T2-32", serialCode: "HDT2103J2613ESA07818", warehouse: "KL", qty: 18 },
  { id: "i13", category: "inverter", model: "R5-5K-S2", serialCode: "HDT2103J2613ESA07955", warehouse: "JB", qty: 45 },
  { id: "i14", category: "inverter", model: "R5-5K-S2", serialCode: "HDT2103J2613ESA07955", warehouse: "KL", qty: 38 },
  { id: "i15", category: "inverter", model: "R5-8K-S2", serialCode: "HDT2103J2613ESA08092", warehouse: "JB", qty: 38 },
  { id: "i16", category: "inverter", model: "R5-8K-S2", serialCode: "HDT2103J2613ESA08092", warehouse: "KL", qty: 30 },
  { id: "i17", category: "inverter", model: "R6-10K-T2", serialCode: "HDT2103J2613ESA08229", warehouse: "JB", qty: 18 },
  { id: "i18", category: "inverter", model: "R6-10K-T2", serialCode: "HDT2103J2613ESA08229", warehouse: "KL", qty: 13 },
  // Hybrid (H2) rows are dummy; they make up the 60 Hybrid units in INVERTER_TYPES.
  { id: "i19", category: "inverter", model: "H2-5K-LS2", serialCode: "HDT2103J2613ESA08366", warehouse: "JB", qty: 10 },
  { id: "i20", category: "inverter", model: "H2-5K-LS2", serialCode: "HDT2103J2613ESA08366", warehouse: "KL", qty: 8 },
  { id: "i21", category: "inverter", model: "H2-8K-LT2", serialCode: "HDT2103J2613ESA08503", warehouse: "JB", qty: 8 },
  { id: "i22", category: "inverter", model: "H2-8K-LT2", serialCode: "HDT2103J2613ESA08503", warehouse: "KL", qty: 6 },
  { id: "i23", category: "inverter", model: "H2-10K-LT2", serialCode: "HDT2103J2613ESA08640", warehouse: "JB", qty: 7 },
  { id: "i24", category: "inverter", model: "H2-10K-LT2", serialCode: "HDT2103J2613ESA08640", warehouse: "KL", qty: 5 },
  { id: "i25", category: "inverter", model: "H2-25K-T3", serialCode: "HDT2103J2613ESA08777", warehouse: "JB", qty: 5 },
  { id: "i26", category: "inverter", model: "H2-25K-T3", serialCode: "HDT2103J2613ESA08777", warehouse: "KL", qty: 3 },
  { id: "i27", category: "inverter", model: "H2-30K-T3", serialCode: "HDT2103J2613ESA08914", warehouse: "JB", qty: 5 },
  { id: "i28", category: "inverter", model: "H2-30K-T3", serialCode: "HDT2103J2613ESA08914", warehouse: "KL", qty: 3 },
  // ── Batteries ── (dummy; highlighted rows are the priority models)
  { id: "b1", category: "battery", model: "B3-16.0-LV", serialCode: "ESB3-160LV", warehouse: "JB", qty: 25, highlight: true },
  { id: "b2", category: "battery", model: "B3-16.0-LV", serialCode: "ESB3-160LV", warehouse: "KL", qty: 12, highlight: true },
  { id: "b3", category: "battery", model: "B3-5.0-LV", serialCode: "ESB3-50LV", warehouse: "JB", qty: 22 },
  { id: "b4", category: "battery", model: "B3-5.0-LV", serialCode: "ESB3-50LV", warehouse: "KL", qty: 11 },
  { id: "b5", category: "battery", model: "B2-5.0-LV1", serialCode: "ESB2-50LV1", warehouse: "JB", qty: 20 },
  { id: "b6", category: "battery", model: "B2-5.0-LV1", serialCode: "ESB2-50LV1", warehouse: "KL", qty: 10 },
  { id: "b7", category: "battery", model: "BU3-5.0-TV2-PRO-BASE", serialCode: "ESBU3-50TV2PB", warehouse: "JB", qty: 15 },
  { id: "b8", category: "battery", model: "BU3-5.0-TV2-PRO-BASE", serialCode: "ESBU3-50TV2PB", warehouse: "KL", qty: 8 },
  { id: "b9", category: "battery", model: "BU3-5.0-TV2-PRO", serialCode: "ESBU3-50TV2P", warehouse: "JB", qty: 13 },
  { id: "b10", category: "battery", model: "BU3-5.0-TV2-PRO", serialCode: "ESBU3-50TV2P", warehouse: "KL", qty: 7 },
  // ── Battery Controller and Other ── (dummy quantities and codes)
  { id: "o1", category: "other", group: "ATS", model: "Single Phase", serialCode: "ATS-1P", warehouse: "JB", qty: 20, highlight: true },
  { id: "o2", category: "other", group: "ATS", model: "Single Phase", serialCode: "ATS-1P", warehouse: "KL", qty: 12, highlight: true },
  { id: "o3", category: "other", group: "ATS", model: "Three Phase", serialCode: "ATS-3P", warehouse: "JB", qty: 14, highlight: true },
  { id: "o4", category: "other", group: "ATS", model: "Three Phase", serialCode: "ATS-3P", warehouse: "KL", qty: 8, highlight: true },
  { id: "o5", category: "other", group: "EV Charger", model: "AC7000-AE-35", serialCode: "EVAC7000AE35", warehouse: "JB", qty: 6 },
  { id: "o6", category: "other", group: "EV Charger", model: "AC7000-AE-35", serialCode: "EVAC7000AE35", warehouse: "KL", qty: 4 },
  { id: "o7", category: "other", group: "EV Charger", model: "AC011K-AE-35", serialCode: "EVAC011KAE35", warehouse: "JB", qty: 5 },
  { id: "o8", category: "other", group: "EV Charger", model: "AC011K-AE-35", serialCode: "EVAC011KAE35", warehouse: "KL", qty: 3 },
];

// ── Stock by Customer page data ────────────────────────────────────────

export type CustomerAllocation = {
  category: "panel" | "inverter" | "battery";
  model: string;
  serialCode: string;
  qty: number;
};

export type CustomerStock = {
  id: string;
  customerName: string;
  warehouse: "JB" | "KL";
  allocations: CustomerAllocation[];
};

// Equipment allocated (reserved or delivered) per customer order.
// Serial codes are per-unit identifiers assigned at dispatch.
// Allocations reuse the serial shown for the same model on the Stock Details page.
function serialFor(model: string): string {
  return STOCK_DETAIL_ITEMS.find((item) => item.model === model)?.serialCode ?? "";
}

export const CUSTOMER_STOCK_ALLOCATIONS: CustomerStock[] = [
  {
    id: "c1",
    customerName: "Lok Suet Lee",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Jinko 620W", serialCode: serialFor("Jinko 620W"), qty: 12 },
      { category: "inverter", model: "R5-7K-S2", serialCode: serialFor("R5-7K-S2"), qty: 1 },
      { category: "battery", model: "B3-5.0-LV", serialCode: serialFor("B3-5.0-LV"), qty: 1 },
    ],
  },
  {
    id: "c2",
    customerName: "Lim Kok Siang",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Jinko 650W", serialCode: serialFor("Jinko 650W"), qty: 16 },
      { category: "inverter", model: "R5-8K-S2", serialCode: serialFor("R5-8K-S2"), qty: 1 },
    ],
  },
  {
    id: "c3",
    customerName: "Chee Chin Fou",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Astronergy 625W", serialCode: serialFor("Astronergy 625W"), qty: 10 },
      { category: "inverter", model: "R5-6K-S2", serialCode: serialFor("R5-6K-S2"), qty: 1 },
      { category: "battery", model: "B2-5.0-LV1", serialCode: serialFor("B2-5.0-LV1"), qty: 1 },
    ],
  },
  {
    id: "c4",
    customerName: "Woo Pek Lai",
    warehouse: "KL",
    allocations: [
      { category: "panel", model: "Jinko 620W", serialCode: serialFor("Jinko 620W"), qty: 14 },
      { category: "inverter", model: "R6-8K-T2", serialCode: serialFor("R6-8K-T2"), qty: 1 },
      { category: "battery", model: "B3-16.0-LV", serialCode: serialFor("B3-16.0-LV"), qty: 1 },
    ],
  },
  {
    id: "c5",
    customerName: "Ahmad Razali",
    warehouse: "KL",
    allocations: [
      { category: "panel", model: "Jinko 650W", serialCode: serialFor("Jinko 650W"), qty: 20 },
      { category: "inverter", model: "R5-5K-S2", serialCode: serialFor("R5-5K-S2"), qty: 1 },
    ],
  },
  {
    id: "c6",
    customerName: "Tan Wei Ming",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Jinko 585W", serialCode: serialFor("Jinko 585W"), qty: 18 },
      { category: "inverter", model: "M2-1.8K-S4", serialCode: serialFor("M2-1.8K-S4"), qty: 4 },
      { category: "battery", model: "BU3-5.0-TV2-PRO", serialCode: serialFor("BU3-5.0-TV2-PRO"), qty: 1 },
    ],
  },
  {
    id: "c7",
    customerName: "Nurul Huda",
    warehouse: "KL",
    allocations: [
      { category: "panel", model: "Astronergy 625W", serialCode: serialFor("Astronergy 625W"), qty: 8 },
      { category: "inverter", model: "R5-6K-S2", serialCode: serialFor("R5-6K-S2"), qty: 1 },
    ],
  },
  {
    id: "c8",
    customerName: "Lee Chong Wei",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Jinko 650W", serialCode: serialFor("Jinko 650W"), qty: 24 },
      { category: "inverter", model: "R6-10K-T2", serialCode: serialFor("R6-10K-T2"), qty: 1 },
      { category: "battery", model: "B3-16.0-LV", serialCode: serialFor("B3-16.0-LV"), qty: 2 },
    ],
  },
  {
    id: "c9",
    customerName: "Siti Aminah",
    warehouse: "KL",
    allocations: [
      { category: "panel", model: "Jinko 620W", serialCode: serialFor("Jinko 620W"), qty: 10 },
      { category: "inverter", model: "R5-5K-S2", serialCode: serialFor("R5-5K-S2"), qty: 1 },
      { category: "battery", model: "B2-5.0-LV1", serialCode: serialFor("B2-5.0-LV1"), qty: 1 },
    ],
  },
  {
    id: "c10",
    customerName: "Raj Kumar",
    warehouse: "JB",
    allocations: [
      { category: "panel", model: "Jinko 585W", serialCode: serialFor("Jinko 585W"), qty: 12 },
      { category: "inverter", model: "R6-20K-T2-32", serialCode: serialFor("R6-20K-T2-32"), qty: 1 },
      { category: "battery", model: "B3-5.0-LV", serialCode: serialFor("B3-5.0-LV"), qty: 1 },
    ],
  },
];

export function generateSupplierSerialList(tx: StockTransaction): SupplierSerialUnit[] {
  const invoice = tx.invoice;
  const items = invoice?.items ?? [];
  const list: SupplierSerialUnit[] = [];

  if (tx.id === "tx-1" || (items.length > 0 && items[0].invoicedQty === 300)) {
    const item = items[0] || {
      skuId: "JKM-620N-72HL4-BDV",
      model: "Jinko Tiger Neo 620W N-Type",
    };
    for (let p = 1; p <= 10; p++) {
      const palletCode = `PAL-JKM-${String(p).padStart(3, "0")}`;
      for (let u = 1; u <= 30; u++) {
        const unitIndex = (p - 1) * 30 + u;
        const serialNo = `E4FXJ425G21750719612${String(unitIndex).padStart(4, "0")}`;
        const flashWatts = +(620.0 + ((unitIndex * 7) % 38) * 0.1).toFixed(1);
        list.push({
          serialNo,
          palletNo: p,
          palletBarcode: palletCode,
          skuId: item.skuId,
          model: item.model,
          flashPowerWatts: flashWatts,
          vmp: +(41.8 + ((unitIndex * 3) % 15) * 0.05).toFixed(2),
          imp: +(14.7 + ((unitIndex * 5) % 12) * 0.02).toFixed(2),
        });
      }
    }
    return list;
  }

  // Generic fallback for other transactions
  items.forEach((item) => {
    const palletSize = item.palletQty || 5;
    for (let i = 1; i <= item.invoicedQty; i++) {
      const pNum = Math.ceil(i / palletSize);
      const palletCode = item.palletBarcode
        ? `${item.palletBarcode.replace(/\d+$/, "")}${String(pNum).padStart(2, "0")}`
        : `PLT-${item.skuId.slice(-4)}-${pNum}`;
      const prefix =
        item.barcode && item.barcode.length >= 10
          ? item.barcode.slice(0, 14)
          : `${item.skuId.replace(/[^A-Z0-9]/g, "")}`;
      list.push({
        serialNo: `${prefix}${String(i).padStart(4, "0")}`,
        palletNo: pNum,
        palletBarcode: palletCode,
        skuId: item.skuId,
        model: item.model,
      });
    }
  });

  return list;
}

// ── Stock Out Dispatch Unit Serial Generation ─────────────────────────

export interface StockOutUnit {
  serialNo: string;
  model: string;
  unitIndex: number;
  category: "panel" | "inverter" | "battery" | "other";
  powerRating: string;
  powerWatts: number;
}

export function generateStockOutSerialList(tx: StockTransaction): StockOutUnit[] {
  const list: StockOutUnit[] = [];
  const qty = tx.qty || 1;
  const baseSerial = tx.serialCode || "SN-OUT-001";
  const cat = tx.category;

  let powerWatts = 620;
  let powerRating = "620W";
  if (cat === "panel") {
    if (tx.model.includes("625")) {
      powerWatts = 625;
      powerRating = "625W";
    } else {
      powerWatts = 620;
      powerRating = "620W";
    }
  } else if (cat === "inverter") {
    if (tx.model.includes("7")) {
      powerWatts = 7000;
      powerRating = "7.0 kW";
    } else if (tx.model.includes("8")) {
      powerWatts = 8000;
      powerRating = "8.0 kW";
    } else if (tx.model.includes("1.8") || tx.model.includes("M2")) {
      powerWatts = 1800;
      powerRating = "1.8 kW";
    } else {
      powerWatts = 5000;
      powerRating = "5.0 kW";
    }
  } else if (cat === "battery") {
    if (tx.model.includes("16")) {
      powerWatts = 16000;
      powerRating = "16.0 kWh";
    } else {
      powerWatts = 5000;
      powerRating = "5.0 kWh";
    }
  }

  for (let i = 1; i <= qty; i++) {
    let serialNo = baseSerial;
    if (qty > 1) {
      if (baseSerial.length > 6 && !isNaN(Number(baseSerial.slice(-3)))) {
        const numPart = parseInt(baseSerial.slice(-3), 10);
        const prefix = baseSerial.slice(0, -3);
        serialNo = `${prefix}${String(numPart + i - 1).padStart(3, "0")}`;
      } else {
        serialNo = `${baseSerial}-${String(i).padStart(2, "0")}`;
      }
    }
    list.push({
      serialNo,
      model: tx.model,
      unitIndex: i,
      category: cat,
      powerRating,
      powerWatts,
    });
  }

  return list;
}

export type StockTransferUnit = {
  serialNo: string;
  model: string;
  unitIndex: number;
  category: "panel" | "inverter" | "battery" | "other";
  powerRating: string;
  powerWatts: number;
  palletNo: number;
  palletBarcode: string;
  fromWarehouse: "JB" | "KL";
  toWarehouse: "JB" | "KL";
};

export function generateStockTransferSerialList(tx: StockTransaction): StockTransferUnit[] {
  const list: StockTransferUnit[] = [];
  const qty = tx.qty || 1;
  const baseSerial = tx.serialCode || "SN-TRF-001";
  const cat = tx.category;
  const fromWh = tx.transfer?.fromWarehouse ?? (tx.warehouse || "JB");
  const toWh = tx.transfer?.toWarehouse ?? (fromWh === "JB" ? "KL" : "JB");

  let powerWatts = 620;
  let powerRating = "620W";
  if (cat === "panel") {
    if (tx.model.includes("625")) {
      powerWatts = 625;
      powerRating = "625W";
    } else {
      powerWatts = 620;
      powerRating = "620W";
    }
  } else if (cat === "inverter") {
    if (tx.model.includes("7")) {
      powerWatts = 7000;
      powerRating = "7.0 kW";
    } else if (tx.model.includes("8")) {
      powerWatts = 8000;
      powerRating = "8.0 kW";
    } else if (tx.model.includes("1.8") || tx.model.includes("M2")) {
      powerWatts = 1800;
      powerRating = "1.8 kW";
    } else {
      powerWatts = 5000;
      powerRating = "5.0 kW";
    }
  } else if (cat === "battery") {
    powerWatts = 16000;
    powerRating = "16.0 kWh";
  }

  for (let i = 1; i <= qty; i++) {
    const palletNo = Math.ceil(i / 5);
    const palletBarcode = `TRF-CTN-${fromWh}-${String(palletNo).padStart(2, "0")}`;
    let serialNo = "";
    if (baseSerial.length >= 10 && !isNaN(Number(baseSerial.slice(-4)))) {
      const numPart = parseInt(baseSerial.slice(-4), 10);
      const prefix = baseSerial.slice(0, -4);
      serialNo = `${prefix}${String(numPart + i - 1).padStart(4, "0")}`;
    } else if (baseSerial.length >= 7 && !isNaN(Number(baseSerial.slice(-3)))) {
      const numPart = parseInt(baseSerial.slice(-3), 10);
      const prefix = baseSerial.slice(0, -3);
      serialNo = `${prefix}${String(numPart + i - 1).padStart(3, "0")}`;
    } else {
      serialNo = `${baseSerial}-${String(i).padStart(2, "0")}`;
    }

    list.push({
      serialNo,
      model: tx.model,
      unitIndex: i,
      category: cat,
      powerRating,
      powerWatts,
      palletNo,
      palletBarcode,
      fromWarehouse: fromWh,
      toWarehouse: toWh,
    });
  }

  return list;
}

