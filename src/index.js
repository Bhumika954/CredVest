// backend/src/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Socket / HTTP
import http from "http";
import { Server as IOServer } from "socket.io";

dotenv.config();

// -------------------- ESM dirname --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- CONNECT MONGODB (dev-friendly: do not exit on failure) --------------------
(async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/credvest";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    // Log a warning but continue so dev routes can be tested even if Mongo is down.
    console.warn("⚠️ MongoDB connection failed (continuing in dev mode):", err.message);
    // NOTE: in production you may want to exit here: process.exit(1);
  }
})();

// -------------------- Load Route Helper --------------------
const loadRoute = async (relPath) => {
  try {
    const filePath = path.join(__dirname, relPath);
    const fileURL = pathToFileURL(filePath).href.replace(/ /g, "%20");
    const mod = await import(fileURL);
    return mod.default || mod.router || mod;
  } catch (err) {
    console.error("❌ Failed loading:", relPath, err.message);
    return null;
  }
};

// -------------------- Express App --------------------
const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded bill images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- Test Routes --------------------
app.get("/", (req, res) => res.json({ message: "CredVest API running 🚀" }));
app.get("/api/health", (_req, res) => res.json({ status: "up" }));

// -------------------- IMPORT ROUTES --------------------
const [
  userRoutes,
  budgetRoutes,
  expenseRoutes,
  incomeRoutes,
  goalRoutes,
  loanRoutes,
  notificationRoutes,
  bankingRoutes,
  authRoutes,
  creditRoutes,       // <-- added creditRoutes here
  goalPlanRoutes,
  featureRoutes,        // <-- added featureRoutes here
  stockRoutes,
  transactionRoutes,
  ocrRoutes,
  dashboardRoutes,
  supportRoutes,
  investmentRoutes,
] = await Promise.all([
  loadRoute("./routes/userRoutes.js"),
  loadRoute("./routes/budgetRoutes.js"),
  loadRoute("./routes/expenseRoutes.js"),
  loadRoute("./routes/incomeRoutes.js"),
  loadRoute("./routes/goalRoutes.js"),
  loadRoute("./routes/loanRoutes.js"),
  loadRoute("./routes/notificationRoutes.js"),
  loadRoute("./routes/bankingRoutes.js"),
  loadRoute("./routes/authRoutes.js"),
  loadRoute("./routes/creditRoutes.js"), // <-- load creditRoutes
  loadRoute("./routes/goalPlanRoutes.js"),
  loadRoute("./routes/featureRoutes.js"), // <-- load featureRoutes
  loadRoute("./routes/stockRoutes.js"),
  loadRoute("./routes/transactionRoutes.js"),
  loadRoute("./routes/ocrRoutes.js"),
  loadRoute("./routes/dashboardRoutes.js"),
  loadRoute("./routes/supportRoutes.js"),
  loadRoute("./routes/investmentRoutes.js"),
]);

// -------------------- USE ROUTES --------------------
if (authRoutes) app.use("/api/auth", authRoutes);
if (userRoutes) app.use("/api/user", userRoutes);
if (budgetRoutes) app.use("/api/budget", budgetRoutes);
if (expenseRoutes) app.use("/api/expense", expenseRoutes);
if (incomeRoutes) app.use("/api/income", incomeRoutes);
if (goalRoutes) app.use("/api/goal", goalRoutes);
if (goalPlanRoutes) app.use("/api/goals", goalPlanRoutes);

// mount features routes so /api/features/* works
if (featureRoutes) app.use("/api/features", featureRoutes);

// Mount credit routes so GET /api/credit/cards works
if (creditRoutes) app.use("/api/credit", creditRoutes);

if (loanRoutes) app.use("/api/loan", loanRoutes);
if (notificationRoutes) app.use("/api/notification", notificationRoutes);
if (stockRoutes) app.use("/api/stocks", stockRoutes);
if (transactionRoutes) app.use("/api/transactions", transactionRoutes);
if (ocrRoutes) app.use("/api/ocr", ocrRoutes);
if (dashboardRoutes) app.use("/api/dashboard", dashboardRoutes);
if (investmentRoutes) app.use("/api/investments", investmentRoutes);

// ✅ Banking routes (keep last for /api prefix)
if (bankingRoutes) app.use("/api", bankingRoutes);

// ✅ Support AI routes
if (supportRoutes) app.use("/api/support", supportRoutes);

// -------------------- Email Setup --------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    method: req.method,
    path: req.originalUrl,
  });
});

// -------------------- Global Error Handler --------------------
app.use((err, _req, res, _next) => {
  console.error("🔥 Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// -------------------- Start server with Socket.IO --------------------
// create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// make io accessible to route handlers: req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);

  // you can handle room joins or auth here if needed
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
});
