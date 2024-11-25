const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Inisialisasi aplikasi Firebase
admin.initializeApp();

// Inisialisasi aplikasi Express
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const predictRoutes = require("./routes/predictRoutes");

// Gunakan routes
app.use("/api/auth", authRoutes);
app.use("/api", predictRoutes);

// Ekspor fungsi Firebase Cloud Function
exports.api = functions.https.onRequest(app);
