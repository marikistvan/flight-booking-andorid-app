const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

router.post('/seatMap', async (req, res) => {
    try {
        console.log('Raw body:', req.body);
        let { log } = req.body;
        console.log('itt vagyok a seatMap postban');
        if (!log) {
            return res.status(400).json({ error: 'Log message is required' });
        }

        await fs.writeFile('seatMap.json', JSON.stringify(log) + '\n', {
            flag: 'a',
        });
        res.json({ message: 'Log saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save log' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { log } = req.body;
        console.log('itt vagyok a postban');
        if (!log) {
            return res.status(400).json({ error: 'Log message is required' });
        }

        await fs.writeFile('masik.json', JSON.stringify(log) + ',\n', {
            flag: 'a',
        });
        res.json({ message: 'Log saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save log' });
    }
});
module.exports = router;
