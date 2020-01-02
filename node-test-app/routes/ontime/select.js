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
 * 検索前処理
 */
router.get("/", function (request, response, next) {
  console.log('定時マスタ検索画面を表示' + request.url);

  let data = {
    title: "定時マスタ検索",
    hasRecord: false
  }
  response.render('ontime/select', data);
});

/**
 * 検索処理
 * companyCodeが未指定の場合、全件検索を行う
 */
router.post("/", function (request, response, next) {

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

  // リクエストパラメータから検索SQLを作成
  let companyCode = request.body["companyCode"];
  if (companyCode != null && companyCode != "") {
    // 企業コードを指定されていた場合、検索条件に含める。
    sql += " WHERE COMPANY_CODE = ?";
  }

  // データを取り出す
  connection.query(sql, companyCode, function(error, results, fields) {

    // データベースアクセス完了時の処理
    if (error == null) {
      let data = {
        title: '定時マスタ検索',
        content: results,
        hasRecord: true
      };

      console.log('--> レンダリング');
      // 下の"ontime/select"の先頭に/を入れると404で落ちる
      response.render('ontime/select', data);
      console.log('<-- レンダリング');
    } else {
      console.log(error.stack);
    }
  });

  console.log('--> DB切断');
  connection.end();
  console.log('<-- DB切断');
});

module.exports = router;