const express = require('express');
const router = express.Router();
const admin = require('../firebase/firebase');
const db = admin.firestore();
const storage = admin.storage();

router.get('/all', async (req, res) => {
    try {
        const users = [];
        let nextPageToken;

        do {
            const result = await admin.auth().listUsers(1000, nextPageToken);
            result.users.forEach((userRecord) => {
                const data = userRecord.toJSON();

                const safeUser = {
                    uid: data.uid,
                    email: data.email,
                    emailVerified: data.emailVerified,
                    disabled: data.disabled,
                    lastSignInTime: data.metadata?.lastSignInTime,
                    creationTime: data.metadata?.creationTime,
                    provider: data.providerData?.[0]?.providerId || 'unknown',
                };

                users.push(safeUser);
            });
            nextPageToken = result.pageToken;
        } while (nextPageToken);

        res.json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
        }));
        const me = users.find((u) => u.uid === 'Tx6CFZr31zfyFZl2R4Ab9ocKp863');
        if (me) {
            console.log(me.profileImageUrl);
        }
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
