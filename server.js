var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mailService = require('./api/mail-server/sendMail.js');
const proxy = require('express-http-proxy');
const path = require("path");

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('build'));
// app.use(express.multipart());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/contact-submit', function (req, res) {
  // save user details to your database.
  const mailResponse = mailService(req.body);
  res.status(200).send('Mail Sent SuccessFully');
});

app.use('*', process.env.NODE_ENV === 'development' ?
  proxy('http://localhost:8000')
  : express.static(__dirname +'/build/')
);

app.listen(3000, function () {
  console.log('Mail Server: Listening on port 3000!');
});
