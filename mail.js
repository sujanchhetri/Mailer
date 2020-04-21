const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});
app.locals.layout = false; 
app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  //  reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'yourmail@gmail.com', // generated ethereal user
        pass: 'password'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <test@gmail.com>', // sender address
      to: ['assface@gmail.com','assface2@gmail.com'],// list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello there! Test message</h1>', // plain text body
      html: output
      //'<h1>Hello there!</h1><br>Test message<br /><img src="cid:uniq-success.jpeg" alt="success" />',
    //  attachments: [
       // {
        //  filename: 'success.jpeg',
         // path: __dirname + '/attach/success.jpeg',
         // cid: 'uniq-success.jpeg' 
       // }
     // ]

    };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(8000, () => console.log('Server started...'));
