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

module.exports = router;
