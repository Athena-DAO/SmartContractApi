var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
  response.send("Get for things");
});

module.exports = router;