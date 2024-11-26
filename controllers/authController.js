// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke Firestore
    const userId = await User.create(email, hashedPassword);

    res.status(201).json({ message: 'Registrasi berhasil', userId });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validasi input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi' });
      }
  
      // Dapatkan pengguna dari Firestore
      const user = await User.findByEmail(email);
  
      if (!user) {
        return res.status(400).json({ message: 'Email atau password salah' });
      }
  
      // Verifikasi password
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({ message: 'Email atau password salah' });
      }
  
      // Buat token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  };
  