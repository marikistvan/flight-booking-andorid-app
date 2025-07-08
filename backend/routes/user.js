const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// POST /api/user/updateFullName
router.post("/updateFullName", async (req, res) => {
  const { uid, firstName, lastName } = req.body;
  try {
    await db.collection("users").doc(uid).set({ firstName, lastName }, { merge: true });
    res.status(200).json({ message: "Név frissítve." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST /api/user/updateBornDate
router.post("/updateBornDate", async (req, res) => {
  const { uid, born } = req.body;
  try {
    await db.collection("users").doc(uid).set({ born }, { merge: true });
    res.status(200).json({ message: "Dátum frissítve." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST /api/user/updatePassword
router.post("/updatePassword", async (req, res) => {
  const { uid, newPassword } = req.body;
  try {
    await admin.auth().updateUser(uid, {
      password: newPassword
    });
    res.status(200).json({ message: "Jelszó frissítve." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// POST /api/user/updateEmail
router.post("/updateEmail", async (req, res) => {
  const { uid, newEmail } = req.body;
  try {
    await admin.auth().updateUser(uid, {
      email: newEmail
    });
    res.status(200).json({ message: "Email frissítve." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;