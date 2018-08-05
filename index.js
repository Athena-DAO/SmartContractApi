var express = require('express');
var app = express();

var things = require('./things');

app.use('/things', things);

app.get('/', function (req, res) {
  res.send("Hello world, again!");
});

app.listen(3000);