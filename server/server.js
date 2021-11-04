const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

require('dotenv').config();

const serviceAccount = require('./clone-54618-firebase-adminsdk-zoxhg-9e0baf1ee0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clone-54618-default-rtdb.firebaseio.com'
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log('connected successfully');
});

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/sent-email', (req, res) => {
  const { to, message, subject } = req.body;
  console.log(req.body);
  const mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vikivarun7@gmail.com',
      pass: 'vikidini7'
    }
  });
  const mailOptions = {
    from: 'vikivarun7@gmail.com',
    to: to,
    subject: subject,
    text: message
  };
  mail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

app.post('/set-admin', async (req, res) => {
  const { uid } = req.body;
  console.log(uid);
  admin
    .auth()
    .setCustomUserClaims('KNTkCjd8JFPp6VZIH8gs1ty3CeK2', { admin: true })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});
