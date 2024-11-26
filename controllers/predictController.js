// controllers/predictController.js
const tf = require('@tensorflow/tfjs-node');
const db = require('../utils/db');
const admin = require('firebase-admin');
const path = require('path');

let model;

// Memuat model saat server dimulai
(async () => {
  try {
    const modelPath = `file://${path.resolve(__dirname, '../ml-model/model.json')}`;
    model = await tf.loadLayersModel(modelPath);
    console.log('Model berhasil dimuat');
  } catch (error) {
    console.error('Gagal memuat model:', error);
  }
})();

function preprocessInput(inputArray) {
  // Urutan fitur: energy, protein, fat, saturated_fat, sugars, fiber, salt
  const means = [200, 10, 5, 2, 15, 3, 0.5];
  const stds = [100, 5, 2, 1, 5, 1, 0.2];

  const normalizedInput = inputArray.map((value, index) => (value - means[index]) / stds[index]);
  return normalizedInput;
}

exports.predict = async (req, res) => {
  try {
    const { energy, protein, fat, saturated_fat, sugars, fiber, salt } = req.body;
    console.log('Received input:', { energy, protein, fat, saturated_fat, sugars, fiber, salt });

    // Validasi input
    if ([energy, protein, fat, saturated_fat, sugars, fiber, salt].some(v => v === undefined)) {
      return res.status(400).json({ message: 'Semua input nutrisi wajib diisi' });
    }

    // Pastikan model telah dimuat
    if (!model) {
      return res.status(500).json({ message: 'Model belum tersedia. Silakan coba lagi nanti.' });
    }

    // Preprocessing input
    const inputArray = [energy, protein, fat, saturated_fat, sugars, fiber, salt];
    const processedInput = preprocessInput(inputArray);
    console.log('Processed input:', processedInput);

    const inputTensor = tf.tensor2d([processedInput]);

    // Melakukan prediksi
    const prediction = model.predict(inputTensor);
    const predictionData = await prediction.data();
    console.log('Raw prediction output:', predictionData);

    // Mengonversi prediksi menjadi grade
    const grade = mapPredictionToGrade(predictionData);
    console.log('Predicted grade:', grade);

    // Menyimpan hasil prediksi ke riwayat
    await db.collection('history').add({
      userId: req.userId,
      inputs: { energy, protein, fat, saturated_fat, sugars, fiber, salt },
      grade,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ grade });
  } catch (error) {
    console.error('Error during prediction:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat prediksi' });
  }
};

// Fungsi untuk mengonversi prediksi menjadi grade
function mapPredictionToGrade(predictionData) {
  // Misalkan model mengeluarkan probabilitas untuk 5 kelas (A, B, C, D, E)
  const grades = ['A', 'B', 'C', 'D', 'E'];
  const maxIndex = predictionData.indexOf(Math.max(...predictionData));
  return grades[maxIndex];
}
