const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(logger);

const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const notificationRoutes = require('./routes/notifications');
app.use('/test', notificationRoutes);

const logRoutes = require('./routes/log');
app.use('/log', logRoutes);

app.get('/', (req, res) => {
    res.send('Backend működik ma is!');
});

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

module.exports = app;
