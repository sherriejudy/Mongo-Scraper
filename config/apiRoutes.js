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
        var links = [];
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
        $(".td-module-image .td-module-thumb a").each((i, element) => {
          links.push($(element).attr("href"));
        });
        for (var i = 0; i < summaries.length; i++) {
          var obj = {};
          obj.title = titles[i];
          obj.summary = summaries[i];
          obj.link = links[i];
          obj.saved = false;
          db.Article.create(obj, function(err, res) {
            if (err) {
              console.log("Judy Error: " + err);
            }
            console.log("sucess");
            console.log(res);
          });
        }
        res.redirect("/");
      });
  });
  app.post("/api/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
  app.post("/api/unsave/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
      .then(() => {
        res.redirect("/saved");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
  app.post("/api/delete/:id", function(req, res) {
    db.Article.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect("/saved");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
};
