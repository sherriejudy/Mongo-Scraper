var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  // your scraping code goes here
  app.get("/", function(req, res) {
    res.render("index");
  });
  app.get("/scrape", function(req, res) {
    // app.get("/scrape", function(req, res) {
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
          summaries.push($(element).text());
        });
        for (var i = 0; i < summaries.length; i++) {
          var obj = {};
          obj.titles = titles[i];
          obj.summaries = summaries[i];
          objects.push(obj);
        }
        console.log(objects);
        res.render("index");
      });
  });
};
