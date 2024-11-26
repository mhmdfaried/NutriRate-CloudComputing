// utils/db.js
const admin = require('firebase-admin');

const serviceAccount = require('./nutrirate-442905-de2998827aca.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
