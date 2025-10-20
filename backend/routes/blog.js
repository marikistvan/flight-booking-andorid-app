const express = require('express');
const router = express.Router();
const admin = require('../firebase/firebase');
const db = admin.firestore();
const storage = admin.storage();

router.post('/upload-blog-image', async (req, res) => {
    try {
        const { uid, base64Image, blogId } = req.body;
        if (!uid || !base64Image || !blogId) {
            return res
                .status(400)
                .json({ error: 'Missing userId or base64Image' });
        }

        const buffer = Buffer.from(base64Image, 'base64');
        const fileName = `${uid}_${Date.now()}`;
        const bucket = storage.bucket('planeticket-6a7fc.firebasestorage.app');
        const filePath = `blog_images/${fileName}`;
        const file = bucket.file(filePath);

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
        }/o/${encodeURIComponent(filePath)}?alt=media&token=${uid}`;

        await db.collection('blog').doc(blogId).update({
            imageUrl: publicUrl,
        });

        res.json({ url: publicUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});
module.exports = router;
