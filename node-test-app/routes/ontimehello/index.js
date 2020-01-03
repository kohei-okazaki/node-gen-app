var express = require("express");
var mysql = require("mysql");
var router = express.Router();
const { check, validationResult } = require('express-validator');

const mysql_setting = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'admin',
  database: 'kinwork'
};

router.get('/index', function(request, response, next) {


  response.render('ontimehello/index', { title: 'Express' });
});

module.exports = router;
