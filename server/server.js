const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

require('dotenv').config();

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
