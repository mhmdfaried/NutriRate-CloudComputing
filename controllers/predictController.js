// controllers/predictController.js
const db = require('../utils/db');
const admin = require('firebase-admin');

exports.predict = async (req, res) => {
  try {
    const { protein, energy, fat, saturated_fat, sugars, fiber, salt } = req.body;

    // Validasi input
    if ([protein, energy, fat, saturated_fat, sugars, fiber, salt].some(v => v === undefined)) {
      return res.status(400).json({ message: 'Semua input nutrisi wajib diisi' });
    }

    // Placeholder untuk prediksi menggunakan model ML
    const grade = 'A'; // Nanti diganti dengan output dari model ML

    // Simpan hasil prediksi ke Firestore
    await db.collection('history').add({
      userId: req.userId,
      inputs: { protein, energy, fat, saturated_fat, sugars, fiber, salt },
      grade,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ grade });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
