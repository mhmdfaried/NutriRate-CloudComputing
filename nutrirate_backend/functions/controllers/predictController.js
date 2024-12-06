exports.predict = async (req, res) => {
  try {
    const { protein, energy, fat, saturated_fat, sugars, fiber, salt } =
      req.body;

    // Validasi input (pastikan semua nilai adalah angka)
    if (
      [protein, energy, fat, saturated_fat, sugars, fiber, salt].some(
        (value) => typeof value !== "number"
      )
    ) {
      return res.status(400).json({ message: "Input tidak valid" });
    }

    // Implementasi logika grading (sesuaikan dengan kebutuhan)
    let score = 0;

    score += protein * 2;
    score += fiber * 2;
    score -= fat * 1.5;
    score -= saturated_fat * 2;
    score -= sugars * 1.5;
    score -= salt * 1;

    let grade;
    if (score >= 20) {
      grade = "A";
    } else if (score >= 10) {
      grade = "B";
    } else if (score >= 0) {
      grade = "C";
    } else {
      grade = "D";
    }

    // (Opsional) Simpan data prediksi ke Firestore
    const db = admin.firestore();
    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("predictions")
      .add({
        protein,
        energy,
        fat,
        saturated_fat,
        sugars,
        fiber,
        salt,
        grade,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ grade });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
