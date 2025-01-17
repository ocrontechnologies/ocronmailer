const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors())
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', process.env.URL);
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
//  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/test', (req, res) => {

    console.log(process.env.EMAIL, process.env.PASS);
    res.json({name:'Vzgo'})
})


app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.values.name}</li>
        <li>Company: ${req.body.values.company}</li>
        <li>Phone: ${req.body.values.phone}</li>
        <li>Email: ${req.body.values.email}</li>
        <li>Business: ${req.body.values.business}</li>
        <li>Website: ${req.body.values.website}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.values.message}</p>
    `;

let transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:  process.env.EMAIL,
        pass: process.env.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

let mailOptions = {
    from: `"ocron website" ${req.body.values.name} ${process.env.EMAIL}`, // sender address
    to: 'ocrontechnologies@gmail.com', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
};

// send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });

  res.send(200, 'sent')
  });

app.listen(process.env.PORT || 8000, () => console.log('Server started...'));