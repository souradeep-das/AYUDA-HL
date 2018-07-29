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

var makeit5star = false;

app.get('/', (req, res, next) => {
  res.render('index.html');
})

app.get('/borrowerDashboard', (req, res, next) => {
  request.get("http://54.201.248.124:3000/api/Loan", (error, response, body) => {
    var data = JSON.parse(body);
    data = JSON.stringify(data);
    for(var i = 0; i < data.length; i++) {
    }
    res.render('web/public/borrower-index.html', {fs: makeit5star, datajson: data});
  });
});

app.get('/lenderDashboard', (req, res, next) => {
  res.render('web/public/lender-index.html')
});

app.get('/borrowerForm', (req, res, next) => {
  res.render('web/public/borrower-form.html')
});

app.get('/borrowerRegister', (req, res, next) => {
  res.render('web/public/borrower-register.html')
});

app.get('/lenderRegister', (req, res, next) => {
  res.render('web/public/lender-register.html')
});

app.post('/createBorrower', (req, res, next) => {
  var aadhar = req.body.aadhar;
  var name = req.body.name;
  var phone = req.body.phone;
  var industry = req.body.industry;
  var yinb = req.body.yinb;
  var funds = req.body.funds;
  var newbjson = {
  "$class": "org.ayuda.CreateBorrower",
  "aadhar": aadhar,
  "name": name,
  "phone": phone,
  "pastrecord": {
    "$class": "org.ayuda.PastRecord",
    "industry": industry,
    "yearInBusiness": yinb,
    "fundsTillNow": funds
  }
};

  request.post({
    url: "http://54.201.248.124:3000/api/CreateBorrower",
    json: newbjson
  }, function(error, response, body) {
    console.log(newbjson);
    //console.log(response);
  });

  res.render('web/public/borrower-form.html')
});

app.post('/createLender', (req, res, next) => {
  var aadhar = req.body.aadhar;
  var name = req.body.name;
  var email = req.body.email;
  var newljson = {
  "$class": "org.ayuda.CreateLender",
  "aadhar": aadhar,
  "name": name,
  "email": email
};

  request.post({
    url: "http://54.201.248.124:3000/api/CreateLender",
    json: newljson
  }, function(error, response, body) {
    console.log(newljson);
    //console.log(response);
  });

  res.render('web/public/lender-index.html')
});

app.post('/newloan', (req, res, next) => {
  var loanid = req.body.fullname;
  var aadhaar = req.body.aadhar;
  var fpid = req.body.fpid;
  var loanamount = req.body.loanamount;
  var story = req.body.story;
  var loanduration = req.body.loanduration;
  var newloanjson = {
  "$class": "org.ayuda.CreateLoan",
  "loanId": loanid,
  "borrower": "resource:org.ayuda.Borrower#" + aadhaar,
  "fieldPartnerId": fpid,
  "loanAmount": loanamount,
  "story": story,
  "loanDuration": loanduration
}

  request.post({
    url: "http://54.201.248.124:3000/api/CreateLoan",
    json: newloanjson
  }, function(error, response, body) {
    console.log(newloanjson);
    //console.log(response);
  });

  res.render('web/public/index.html')
});

app.post('/makePayment', (req, res, next) => {
  var payamount = req.body.payamount;
  var loanid = req.body.loanid;
  var lenderid = req.body.lenderid;
  var newpjson = {
  "$class": "org.ayuda.PayLoan",
  "loan": "resource:org.ayuda.Loan#" + loanid,
  "lender": "resource:org.ayuda.Lender#" + lenderid,
  "amount": payamount
};

  request.post({
    url: "http://54.201.248.124:3000/api/PayLoan",
    json: newpjson
  }, function(error, response, body) {
    console.log(newpjson);
    //console.log(response);
  });

  res.render('web/public/payment.html')
});

app.post('/repayLoan', (req, res, next) => {
  var payamount = req.body.payamount;
  var loanid = req.body.loanid;
  var newrjson = {
  "$class": "org.ayuda.PayBack",
  "loan": "resource:org.ayuda.Loan#" + loanid,
  "amount": payamount
};

  request.post({
    url: "http://54.201.248.124:3000/api/PayBack",
    json: newrjson
  }, function(error, response, body) {
    console.log(newrjson);
    //console.log(response);
  });

  request.get("http://54.201.248.124:3000/api/Loan", (error, response, body) => {
    var data = JSON.parse(body);
    data = JSON.stringify(data);
    for(var i = 0; i < data.length; i++) {
        console.log(data[i]);
        console.log("------------")
    }
    makeit5star = true;
    res.render('web/public/borrower-empty.html', {datajson: data});

  });
});

app.get('/browseloans', (req, res, next) => {
  res.render('web/public/fp-tab-panel.html')
});

app.post('/verifyloan', (req, res, next) => {
  res.render('web/public/borrower-tab-panel.html')
});

app.get('/payloans', (req, res, next) => {
  request.get("http://54.201.248.124:3000/api/Loan", (error, response, body) => {
    var data = JSON.parse(body);
    data = JSON.stringify(data);
    for(var i = 0; i < data.length; i++) {
        console.log(data[i]);
        console.log("------------")
    }
    res.render('web/public/lender-tab-panel.html', {datajson: data});
  });
});

app.get('/payloansnext', (req, res, next) => {
  res.render('web/public/lender-browse-next.html')
});

app.get('/payback', (req, res, next) => {
  res.render('web/public/borrower-browse-next.html')
});

app.get('/bloansummary', (req, res, next) => {
  request.get("http://54.201.248.124:3000/api/Loan", (error, response, body) => {
    var data = JSON.parse(body);
    data = JSON.stringify(data);
    for(var i = 0; i < data.length; i++) {
        console.log(data[i]);
        console.log("------------")
    }
    makeit5star = true;
    res.render('web/public/borrower-empty.html', {datajson: data});

  });
});

app.get('/xx', (req, res, next) => {
  request.get("http://54.201.248.124:3000/api/CreateTrainer", (error, response, body) => {
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
//http://54.201.248.124:3000/api/CreateTrainer
app.get('/yy', (req, res, next) => {

  request.post({
    url: "http://54.201.248.124:3000/api/CreateTrainer",
    json: samplejson
  }, function(error, response, body) {
    console.log("hello");
    console.log(response);
   res.render('web/public/index2.html');
 });
});

var server = http.createServer(app);

server.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});
