var express = require('express');
var router = express.Router();

router.get('/input', function(request, response, next) {
  var data  = {
    title : "ユーザ情報入力画面",
    content : "ユーザIDとパスワードを入力してください",
    dispType : "1"
  };
  response.render("user", data);
});

router.post('/confirm', function(request, response, next) {
  var userId = request.body["userId"];
  var password = request.body["password"];
  
  var data = {
    title : "ユーザ情報確認画面",
    content : "あなたのユーザIDは" + userId + "、パスワードは" + password + "です",
    userId : userId,
    password : password,
    dispType : "2"
  };
  response.render("user", data);
});

router.post('/complete', function(request, response, next) {

  var userId = request.body["userId"];
  var password = request.body["password"];
  
  var data = {
    title : "ユーザ情報完了画面",
    content : "ユーザ登録が完了しました",
    userId : userId,
    password : password,
    dispType : "3"
  };
  response.render("user", data);
});

module.exports = router;