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

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
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
      // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
      // ※※※ 下の"ontime/select"の先頭に/を入れると404で落ちる  ※※※
      // ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
      response.render('ontime/select', data);
    } else {
      console.log(error.stack);
    }
  });

  connection.end();
});

module.exports = router;