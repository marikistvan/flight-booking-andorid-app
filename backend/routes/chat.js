const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

function generateChatId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

// POST /api/chat
router.post('/create', async (req, res) => {
  const { userId1, userId2 } = req.body;
  if (!userId1 || !userId2) {
    return res.status(400).json({ error: 'Két userId szükséges' });
  }

  const chatId = generateChatId(userId1, userId2);
  const chatRef = db.collection('chats').doc(chatId);

  try {
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists) {
      await chatRef.set({
        participants: [userId1, userId2],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastMessage: null,
        lastMessageTimestamp: null
      });
    }

    return res.status(200).json({ chatId });
  } catch (error) {
    console.error('Chat létrehozás hiba:', error);
    return res.status(500).json({ error: 'Szerverhiba' });
  }
});

module.exports = router;
