const express = require('express');
const router = express.Router();
const { db } = require('../firebase/firebase');

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;