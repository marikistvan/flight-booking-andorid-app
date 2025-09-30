const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const storage = admin.storage();

// Profilkép feltöltése
router.post('/upload-profile-image', async (req, res) => {
    try {
        const { uid, base64Image } = req.body;
        if (!uid || !base64Image) {
            return res
                .status(400)
                .json({ error: 'Missing userId or base64Image' });
        }

        const buffer = Buffer.from(base64Image, 'base64');
        const fileName = `${uid}_${Date.now()}`;
        const bucket = storage.bucket('planeticket-6a7fc.firebasestorage.app');
        const file = bucket.file(fileName);

        await file.save(buffer, {
            metadata: {
                contentType: 'image/jpeg',
                metadata: {
                    firebaseStorageDownloadTokens: uid,
                },
            },
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media&token=${uid}`;

        await db.collection('users').doc(uid).update({
            profileImageUrl: publicUrl,
        });

        res.json({ url: publicUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});
// POST /api/user/updateFullName
router.post('/updateFullName', async (req, res) => {
    const { uid, firstName, lastName } = req.body;
    try {
        await db
            .collection('users')
            .doc(uid)
            .set({ firstName, lastName }, { merge: true });
        res.status(200).json({ message: 'Név frissítve.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/user/updateBornDate
router.post('/updateBornDate', async (req, res) => {
    const { uid, born } = req.body;
    try {
        await db.collection('users').doc(uid).set({ born }, { merge: true });
        res.status(200).json({ message: 'Dátum frissítve.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/user/updateSexType
router.post('/updateSexType', async (req, res) => {
    const { uid, sexType } = req.body;
    try {
        await db
            .collection('users')
            .doc(uid)
            .set({ genre: sexType }, { merge: true });
        res.status(200).json({ message: 'Neme frissítve.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/user/updatePassword
router.post('/updatePassword', async (req, res) => {
    const { uid, newPassword } = req.body;
    try {
        await admin.auth().updateUser(uid, {
            password: newPassword,
        });
        res.status(200).json({ message: 'Jelszó frissítve.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/user/updateEmail
router.post('/updateEmail', async (req, res) => {
    const { uid, newEmail } = req.body;
    try {
        await admin.auth().updateUser(uid, {
            email: newEmail,
        });
        res.status(200).json({ message: 'Email frissítve.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//planeticket-6a7fc.firebasestorage.app

module.exports = router;
