var express = require("express");
var mysql = require("mysql");
var router = express.Router();

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

var ontimeMt = Bookshelf.Model.extend({
  tableName: "ONTIME_MT"
});

router.get('/index', function(request, response, next) {
  new ontimeMt().fetchAll().then((connection) => {
    let data = {
      title: "定時マスタ(BookShelf利用)",
      content: connection.toArray()
    }
    response.render('ontimehello/index', data);
  })
  .catch(function(err) {
    response.status(500).json({
      error: true,
      data: {
        message: err.message
      }
    });
  });
});

router.get("/insert", function(request, response, next) {
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
  response.render('ontimehello/insert', data);
});

router.post("/insert", function(request, response, next) {
  let res = response;
  let entity = {
    "COMPANY_CODE": request.body.companyCode,
    "WORK_START_HOUR": request.body.workStartHour,
    "WORK_START_MINUTE": request.body.workStartMinute,
    "WORK_END_HOUR": request.body.workEndHour,
    "WORK_END_MINUTE": request.body.workEndMinute,
  };
  new ontimeMt(entity).save().then(function(model) {
    let data = {
      title: "定時マスタ登録(BookShelf利用)",
      entity: entity
    }
    response.render('ontimehello/index', data);
  });
});

module.exports = router;
