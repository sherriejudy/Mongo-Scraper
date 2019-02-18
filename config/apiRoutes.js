var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {
    axios
      .get("https://thenewspaper.ca/category/arts/")
      .then(function(axios_response) {
        var $ = cheerio.load(axios_response.data);
        var titles = [];
        var summaries = [];
        var objects = [];
        $("h3.entry-title.td-module-title a").each((i, element) => {
          titles.push($(element).text());
        });
        $(".td-excerpt").each((i, element) => {
          var split = $(element)
            .text()
            .split("\n");
          for (var j = 0; j < split.length; j++) {
            if (split[i] === "") {
              split.splice(i, 1);
            }
          }
          summaries.push(split);
        });
        for (var i = 0; i < summaries.length; i++) {
          var obj = {};
          obj.title = titles[i];
          obj.summary = summaries[i];
          obj.link = "hi";
          db.Article.create(obj, function(err, res) {
            if (err) {
              console.log("Judy Error: " + err);
            }
            console.log("sucess");
            console.log(res);
          });
        }
        res.render("index");
      });
  });
};
