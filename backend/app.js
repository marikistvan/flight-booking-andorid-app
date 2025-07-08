const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const usersRoute = require('./routes/users'); 
app.use('/api/users', usersRoute);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Backend működik ma is!');
});

module.exports = app;