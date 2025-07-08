const { OpenAI } = require("openai");
require("dotenv").config();
const admin = require('firebase-admin');
const db = admin.firestore();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.askChatGPT = async (req, res) => {
  const { prompt } = req.body;
  console.log("promt: "+prompt);
  if (!prompt || !Array.isArray(prompt) || prompt.length === 0) {
    return res.status(400).json({ error: "Hiányzik a chatHistory vagy üres." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Segítőkész repülő asszisztens vagy egy repülőjegy foglaló alkalmazásban. Segítesz utazás és szállás témakörben. Egyéb témákban viszont nem." },
        ...prompt
      ],
    });

    const answer = response.choices[0].message.content;
    res.status(200).json({ response: answer });
  } catch (error) {
    console.error("Hiba a ChatGPT API hívásnál:", error.message);
    res.status(500).json({ error: "Hiba történt a válasz lekérésekor." });
  }
};
exports.createChatIfNotExists = async (req, res) => {
  const { userId1, userId2 } = req.body;
  console.log("hallo, itt vagyok a chatControllerbe");
  if (!userId1 || !userId2) {
    return res.status(400).json({ error: 'Két userId szükséges' });
  }

  const chatId = [userId1, userId2].sort().join('_');
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
  } catch (err) {
    console.error('Chat létrehozási hiba:', err);
    return res.status(500).json({ error: 'Szerverhiba' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, message } = req.body;

    if (!chatId || !senderId || !message) {
      return res.status(400).json({ error: "chatId, senderId és message szükséges" });
    }

    const chatRef = db.collection("chats").doc(chatId);
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists) {
      return res.status(404).json({ error: "A chat nem létezik" });
    }
    if (chatSnap.exists) {
      const chatData = chatSnap.data();
      if(chatData.participants[0]!=senderId && chatData.participants[1]!=senderId){
        return res.status(400).json({ error: "Nem tagja a chatnek" });
      }
    }
    const messageRef = await chatRef.collection("messages").add({
      senderId,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    await chatRef.update({
      lastMessage: message,
      lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ messageId: messageRef.id });

  } catch (err) {
    console.error("Üzenetküldési hiba:", err);
    return res.status(500).json({ error: "Szerverhiba" });
  }
};