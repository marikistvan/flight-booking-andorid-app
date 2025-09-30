const admin = require('firebase-admin');

exports.test = async (req, res) => {
  const { tokens, notification, data } = req.body;
  const tokensArray = Array.isArray(tokens) ? tokens : [tokens];

  const message = {
    tokens: tokensArray,
    notification,
    data,
  };

  admin.messaging().sendEachForMulticast(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.json({ success: true, response });
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).json({ success: false, error });
    });
};
