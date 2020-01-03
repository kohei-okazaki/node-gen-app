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
 * 新規作成ページへのアクセス
 */
router.get("/", function (request, response, next) {

  console.log('定時マスタ登録画面を表示' + request.url);

  var data = {
    title: "定時マスタ新規作成",
    hasRecord: false,
    form: {
      companyCode: "",
      workStartHour: "",
      workStartMinute: "",
      workEndHour: "",
      workEndMinute: ""
    },
    errorMessageArray: []
  }
  response.render('ontime/insert', data);
});

/**
 * 新規レコード作成処理
 */
router.post("/", [
  check("companyCode")
    .notEmpty().withMessage("企業コードは必須です")
    .isNumeric().withMessage("企業コードは数字です")
    .isLength({ 
      min: 5, 
      max: 5
    }).withMessage("企業コードは5桁です"),

  check("workStartHour")
    .notEmpty().withMessage("始業時間(時)は必須です")
    .isNumeric().withMessage("始業時間(時)は数字です")
    .isLength({ 
      min: 2, 
      max: 2
    }).withMessage("始業時間(時)は2桁です"),

  check("workStartMinute")
    .notEmpty().withMessage("始業時間(分)は必須です")
    .isNumeric().withMessage("始業時間(分)は数字です")
    .isLength({ 
      min: 2, 
      max: 2
    }).withMessage("始業時間(分)は2桁です"),

  check("workEndHour")
    .notEmpty().withMessage("終業時間(時)は必須です")
    .isNumeric().withMessage("終業時間(時)は数字です")
    .isLength({ 
      min: 2, 
      max: 2
    }).withMessage("終業時間(時)は2桁です"),

  check("workEndMinute")
    .notEmpty().withMessage("終業時間(分)は必須です")
    .isNumeric().withMessage("終業時間(分)は数字です")
    .isLength({ 
      min: 2, 
      max: 2
    }).withMessage("終業時間(分)は2桁です")

], function(request, response, next) {

  let companyCode = request.body.companyCode;
  let workStartHour = request.body.workStartHour;
  let workStartMinute = request.body.workStartMinute;
  let workEndHour = request.body.workEndHour;
  let workEndMinute = request.body.workEndMinute;
  let form = {
    companyCode: companyCode,
    workStartHour: workStartHour,
    workStartMinute: workStartMinute,
    workEndHour: workEndHour,
    workEndMinute: workEndMinute
  };

  // バリデーションの結果にエラーがあるかのチェック
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    // 妥当性チェックエラーでない場合

    // Entityを作成
    let entity = {
      COMPANY_CODE: companyCode,
      WORK_START_HOUR: workStartHour,
      WORK_START_MINUTE: workStartMinute,
      WORK_END_HOUR: workEndHour,
      WORK_END_MINUTE: workEndMinute
    };

    let connection = mysql.createConnection(mysql_setting);
    connection.connect();

    // データを取り出す
    let sql = "insert into ONTIME_MT set ?";
    connection.query(sql, entity, function(error, results, fields) {

      // データベースアクセス完了時の処理
      if (error == null) {
        // 正常終了の場合
        let data = {
          title: '定時マスタ登録結果',
          entity: entity,
          hasRecord: true,
          form: form,
          errorMessageArray: []
        };
        response.render('ontime/insert', data);
      } else {
        console.log(error.stack);
        response.render('ontime/insert', data);
      }
    });
    connection.end();

  } else {
    // 妥当性チェックエラーの場合

    console.log(errors.array());
    let data = {
      title: '定時マスタ新規作成',
      hasRecord: false,
      form: form,
      errorMessageArray: errors.array()
    };
    response.render('ontime/insert', data);

  }

});

module.exports = router;