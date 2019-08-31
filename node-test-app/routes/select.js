var express = require("express");
var mysql = require("mysql");
var router = express.Router();

const mysql_setting = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'admin',
  database: 'kinwork'
};


// router.get("/", function (request, response, next) {

//   var a = {
//     companyCode: '0001',
//     workStartHour: '1-1',
//     workStartMinute: '1-2',
//     workEndHour: '1-3',
//     workEndMinute: '1-4'
//   };

//   var b = {
//     companyCode: '0002',
//     workStartHour: '2-1',
//     workStartMinute: '2-2',
//     workEndHour: '2-3',
//     workEndMinute: '2-4'
//   };

//   var array = [a, b];

//   var data = {
//     title: 'mysqlセレクト',
//     content: array
//   };

//   response.render('select', data);
// });

router.get("/", function (request, response, next) {

  console.log('--> コネクションの用意');
  // コネクションの用意
  var connection = mysql.createConnection(mysql_setting);
  console.log('<-- コネクションの用意');

  console.log('--> データベースに接続');
  // データベースに接続
  connection.connect();
  console.log('<-- データベースに接続');

  var sql = 'SELECT * FROM ONTIME_MT';
  // データを取り出す
  connection.query(sql, function(error, results, fields) {

    // データベースアクセス完了時の処理
    if (error == null) {
      var data = {
        title: 'mysqlセレクト',
        content: results
      };

      console.log('--> レンダリング');
      response.render('select', data);
      console.log('<-- レンダリング');
    } else {
      console.log(error.stack);
    }
  });

  console.log('--> DB接続解除');
  connection.end();
  console.log('<-- DB接続解除');
});

module.exports = router;