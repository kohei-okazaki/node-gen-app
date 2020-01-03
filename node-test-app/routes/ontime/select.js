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

/**
 * 検索前処理
 */
router.get("/", function (request, response, next) {
  console.log('定時マスタ検索画面を表示' + request.url);

  let data = {
    title: "定時マスタ検索",
    hasRecord: false,
    form: {
      companyCode: ""
    },
    errorMessageArray: []
  }
  response.render('ontime/select', data);
});

/**
 * 検索処理
 * 企業コードが未指定の場合、全件検索を行う
 */
router.post("/", [

  check("companyCode")
    .isNumeric().withMessage("企業コードは数字です")

], function (request, response, next) {

  console.log('定時マスタ検索画面を表示' + request.url);

  let companyCode = request.body["companyCode"];
  let form = {
    companyCode: companyCode
  }

  // バリデーションの結果にエラーがあるかのチェック
  const errors = validationResult(request);
  if (errors.isEmpty() || (companyCode === "")) {
    // 妥当性チェックエラーでない場合

    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    let sql = 'SELECT * FROM ONTIME_MT';
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
          hasRecord: true,
          form: form,
          errorMessageArray: []
        };

        // ※※※ 下の"ontime/select"の先頭に/を入れると404で落ちる  ※※※
        response.render('ontime/select', data);
      } else {
        console.log(error.stack);
      }
    });

  } else {

    let data = {
      title: '定時マスタ検索',
      hasRecord: false,
      form: form,
      errorMessageArray: errors.array()
    };
    response.render('ontime/select', data);

  }


  connection.end();
});

module.exports = router;