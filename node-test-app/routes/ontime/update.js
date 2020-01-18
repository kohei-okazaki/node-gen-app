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
 * 更新ページへのアクセス
 */
router.get("/", function (request, response, next) {

  console.log('定時マスタ更新画面を表示' + request.url);

  let companyCode = request.query.companyCode;
  console.log("企業コード(request.query.companyCode)=" + request.query.companyCode);
  console.log("企業コード(request.body.companyCode)=" + request.body.companyCode);
  let sql = "SELECT * FROM ONTIME_MT";
  if (companyCode !== null && companyCode !== "") {
    console.log("企業コードの指定あり")
    sql +=  " WHERE COMPANY_CODE = ?";
  }
  let connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(sql, companyCode, function(error, results, fields) {
    if (error == null) {
      let data = {
        title: "定時マスタ更新",
        entity: results[0]
      };
      response.render('ontime/update', data);
    }
  });
  connection.end();
});

/**
 * 更新処理
 */
router.post("/", function(request, response, next) {

  let companyCode = request.body.companyCode;
  let workStartHour = request.body.workStartHour;
  let workStartMinute = request.body.workStartMinute;
  let workEndHour = request.body.workEndHour;
  let workEndMinute = request.body.workEndMinute;
  let entity = {
    "COMPANY_CODE": companyCode,
    "WORK_START_HOUR": workStartHour,
    "WORK_START_MINUTE": workStartMinute,
    "WORK_END_HOUR": workEndHour,
    "WORK_END_MINUTE": workEndMinute,
  };

  let connection = mysql.createConnection(mysql_setting);
  connection.connect();
  let sql = "UPDATE ONTIME_MT SET ? WHERE COMPANY_CODE = ?";
  connection.query(sql, [entity, companyCode], function(error, results, fields) {

    // データベースアクセス完了時の処理
    if (error == null) {
      // 正常終了の場合
      let data = {
        title: '定時マスタ登録結果',
        entity: entity,
        hasRecord: true
      };
      response.render('ontime/update', data);
    } else {
      console.log(error.stack);
      response.render('ontime/update', data);
    }
  });

  connection.end();
});

module.exports = router;