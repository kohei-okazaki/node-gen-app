var express = require("express");
var router = express.Router();

router.get("/", function(request, response, next) {
  var data  = {
    title : "メニュー画面",
    content : "メニュー画面のコンテンツ"
  }
  response.render("menu", data);
});

module.exports = router;