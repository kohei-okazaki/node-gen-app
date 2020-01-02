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

/**
 * 新規作成ページへのアクセス
 */
router.get("/", function (request, response, next) {

  console.log('定時マスタ登録画面を表示' + request.url);

  var data = {
    title: "新規作成",
    content: "新しいレコードを入力："
  }
  response.render('ontime/insert', data);
});

/**
 * 新規レコード作成処理
 */
router.post("/", function(request, response, next) {
  var companyCode = request.body.companyCode;
  var workStartHour = request.body.workStartHour;
  var workStartMinute = request.body.workStartMinute;
  var workEndHour = request.body.workEndHour;
  var workEndMinute = request.body.workEndMinute;
  var data = {
    "COMPANY_CODE": companyCode,
    "WORK_START_HOUR": workStartHour,
    "WORK_START_MINUTE": workStartMinute,
    "WORK_END_HOUR": workEndHour,
    "WORK_END_MINUTE": workEndMinute,
  };

  console.log('--> コネクションの用意');
  // DBの設定情報
  var connection = mysql.createConnection(mysql_setting);
  console.log('<-- コネクションの用意');

  console.log('--> データベースに接続');
  // DB接続
  connection.connect();
  console.log('<-- データベースに接続');

  // データを取り出す
  connection.query("insert into ONTIME_MT set ?", data, function(error, results, fields) {

    // データベースアクセス完了時の処理
    if (error == null) {
      // 正常終了の場合
      var data = {
        title: '登録結果',
        content: results
      };
      console.log('--> レンダリング');
      response.render('ontime/insert', data);
      console.log('<-- レンダリング');
    } else {
      console.log(error.stack);
    }
  });

  // 接続を解除
  connection.end();

});

module.exports = router;