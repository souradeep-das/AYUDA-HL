'use strict';

const http = require('http');
const fs = require('fs');
const express = require('express')
const path = require('path');
var bodyParser = require('body-parser');
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.static(path.resolve(`${__dirname}/web/public`)));
console.log(`${__dirname}/web`);
app.use('*', (req, res, next) => {
  console.log(`URL: ${req.baseUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-access-token');
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    res.send(err);
  }
});

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views/web/public'));

app.get('/', (req, res, next) => {
  res.render('index.html');
})

app.get('/borrowerDashboard', (req, res, next) => {
  res.render('web/public/borrower-index.html')
});

app.get('/lenderDashboard', (req, res, next) => {
  res.render('web/public/lender-index.html')
});

app.get('/borrowerForm', (req, res, next) => {
  res.render('web/public/borrower-form.html')
});

app.post('/newloan', (req, res, next) => {
  res.render('web/public/fp-index.html')
});

app.get('/browseloans', (req, res, next) => {
  res.render('web/public/fp-tab-panel.html')
});

app.post('/verifyloan', (req, res, next) => {
  res.render('web/public/lender-tab-panel.html')
});

app.get('/payloans', (req, res, next) => {
  res.render('web/public/lender-tab-panel.html')
});

app.get('/payloansnext', (req, res, next) => {
  res.render('web/public/lender-browse-next.html')
});

app.get('/bloansummary', (req, res, next) => {
  res.render('web/public/borrower-table.html')
});

app.get('/xx', (req, res, next) => {
  request.get("http://localhost:3000/api/CreateTrainer", (error, response, body) => {
   var data = JSON.parse(body);
   console.log(response.body);
   var myjson = JSON.stringify(response.body);
   myjson = JSON.parse(myjson);
   var foo = JSON.parse(myjson);
   //res.send(foo[0].email);
   var x = String(foo[0].email);
   var y = String(foo[0].orgType);
   console.log(x);
   res.render('web/public/index1.html', {data:x, data2: y});
 });
});

var samplejson = {
  "$class": "org.esdm.CreateTrainer",
  "regno": "1325",
  "instituteName": "srmuuu",
  "email": "sdxxx",
  "orgType": "dsd",
  "pin": "1233",
  "transactionId": "",
  "timestamp": "2018-06-07T09:44:03.490Z"
};

app.get('/yy', (req, res, next) => {

  request.post({
    url: "http://localhost:3000/api/CreateTrainer",
    json: samplejson
  }, function(error, response, body) {
    console.log("hello");
    console.log(response);
   res.render('web/public/index2.html');
 });
});

var server = http.createServer(app);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
