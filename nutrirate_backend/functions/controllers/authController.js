const admin = require("firebase-admin");

// Middleware untuk memverifikasi token ID Firebase
exports.verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization
    ? req.headers.authorization.split("Bearer ")[1]
    : null;

  if (!idToken) {
    return res
      .status(401)
      .json({ message: "Tidak ada token, otorisasi ditolak" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token tidak valid", error: error.message });
  }
};
