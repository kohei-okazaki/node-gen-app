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

router.get("/", function (request, response, next) {

  console.log('定時マスタ検索画面を表示' + request.url);

  console.log('--> コネクションの用意');
  // コネクションの用意
  var connection = mysql.createConnection(mysql_setting);
  console.log('<-- コネクションの用意');

  console.log('--> データベースに接続');
  // データベースに接続
  connection.connect();
  console.log('<-- データベースに接続');

  let sql = 'SELECT * FROM ONTIME_MT';
  // データを取り出す
  connection.query(sql, function(error, results, fields) {

    // データベースアクセス完了時の処理
    if (error == null) {
      var data = {
        title: '定時マスタ検索結果画面',
        content: results
      };

      console.log('--> レンダリング');

      // 下の"ontime/select"の先頭に/を入れると404で落ちる
      response.render('ontime/select', data);
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