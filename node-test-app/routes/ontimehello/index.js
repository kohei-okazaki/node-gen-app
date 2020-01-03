var express = require("express");
var router = express.Router();
var mysql = require("mysql");
const { check, validationResult } = require('express-validator');

const knex = require("knex")({
  dialect: "mysql",
  connection: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'kinwork'
  }
});
var Bookshelf = require("bookshelf")(knex);

// 定時マスタ
var ontimeMt = Bookshelf.Model.extend({
  tableName: "ONTIME_MT"
});

/**
 * 定時マスタ検索のGET
 * /select
 */
router.get('/select', function(request, response, next) {
  console.log('定時マスタ検索画面を表示' + request.url);

  let data = {
    title: "定時マスタ検索(BookShelf利用)",
    hasRecord: false,
    form: {
      companyCode: ""
    },
    errorMessageArray: []
  };
  response.render('ontimehello/select', data);

  }
);

/**
 * 定時マスタ検索のPOST
 * 企業コードが未指定の場合、全件検索を行う
 * /select
 */
router.post("/select", [

  check("companyCode")
    .isNumeric().withMessage("企業コードは数字です")

], function(request, response, next) {

  console.log('定時マスタ検索画面を表示' + request.url);

  let form = {
    companyCode: request.body.companyCode
  };

  // バリデーションの結果にエラーがあるかのチェック
  const errors = validationResult(request);

  if (errors.isEmpty() || (form.companyCode === "")) {
    // 妥当性チェックエラーでない場合
    if (form.companyCode === "") {
      // 企業コードが未指定の場合、全件検索
      new ontimeMt().fetchAll().then((connection) => {
        let data = {
          title: "定時マスタ検索(BookShelf利用)",
          content: connection.toArray(),
          errorMessageArray: [],
          hasRecord: true,
          form: form
        };
        response.render('ontimehello/select', data);
      })
      .catch(function(err) {
        response.status(500).json({
          error: true,
          data: {
            message: err.message
          }
        });
      });
    }

  } else {
    // TODO 指定した企業コードで検索
  }

});

/**
 * 定時マスタ登録のGET
 * /insert
 */
router.get("/insert", function(request, response, next) {
  console.log('定時マスタ登録画面を表示' + request.url);
  var data = {
    title: "定時マスタ新規作成(BookShelf利用)",
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
  response.render('ontimehello/insert', data);
});

/**
 * 定時マスタ登録のPOST
 * /insert
 */
router.post("/insert", [

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

  // 入力値をFormに設定
  let form = {
    companyCode: request.body.companyCode,
    workStartHour: request.body.workStartHour,
    workStartMinute: request.body.workStartMinute,
    workEndHour: request.body.workEndHour,
    workEndMinute: request.body.workEndMinute
  };

  // FormをEntityに設定
  let entity = {
    COMPANY_CODE: form.companyCode,
    WORK_START_HOUR: form.workStartHour,
    WORK_START_MINUTE: form.workStartMinute,
    WORK_END_HOUR: form.workEndHour,
    WORK_END_MINUTE: form.workEndMinute
  };

  // バリデーション結果にエラーがあるかのチェック
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    // 妥当性チェックエラーでない場合、DB登録

    // DB登録後に以下のエラーが出る
    // {"error":true,"data":{"message":"select `ONTIME_MT`.* from `ONTIME_MT` where `ONTIME_MT`.`id` = 0 limit 1 - 
    // ER_BAD_FIELD_ERROR: Unknown column 'ONTIME_MT.id' in 'where clause'"}}
    new ontimeMt(entity).save().then(function(model) {
      let data = {
        title: "定時マスタ登録(BookShelf利用)",
        entity: entity,
        form: form,
        hasRecord: true,
        errorMessageArray: []
      }
      response.render('ontimehello/insert', data);
    })
    .catch(function(err) {
      response.status(500).json({
        error: true,
        data: {
          message: err.message
        }
      });
    });
  } else {
    console.log(errors.array());
    let data = {
      title: '定時マスタ登録(BookShelf利用)',
      hasRecord: false,
      form: form,
      errorMessageArray: errors.array()
    };
    response.render('ontimehello/insert', data);
  }

});

module.exports = router;
