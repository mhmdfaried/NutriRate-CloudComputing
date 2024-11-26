// models/User.js
const db = require('../utils/db');

class User {
  static async create(email, password) {
    const userRef = db.collection('users').doc();
    await userRef.set({
      email,
      password,
    });
    return userRef.id;
  }

  static async findByEmail(email) {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return null;
    }

    let user;
    snapshot.forEach(doc => {
      user = { id: doc.id, ...doc.data() };
    });
    return user;
  }
}

module.exports = User;
