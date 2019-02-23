var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
  //scrape articles
  app.get("/scrape", function(req, res) {
    axios.get("https://thenewspaper.ca/").then(function(axios_response) {
      var $ = cheerio.load(axios_response.data);
      var titles = [];
      var summaries = [];
      var links = [];
      var pages = $("ul#menu-navigation-1 li.menu-item-type-taxonomy a");
      var categories = [];
      // Iterate through the pages
      for (var i = 0; i < pages.length; i++) {
        let url = $(pages[i]).attr("href");
        // Get current page
        axios.get(url).then(response => {
          $ = cheerio.load(response.data);
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
          var successfullyScrapedPage = false;
          for (var i = 0; i < summaries.length; i++) {
            var obj = {};
            obj.title = titles[i];
            obj.summary = summaries[i];
            obj.link = links[i];
            obj.saved = false;
            console.log("Trying to find" + obj.title);
            db.Article.find({ link: obj.link })
              .then(article => {
                console.log("found" + obj.title);
                // Check if article exists already. If it does, skip this page.
              })
              .catch(err => {
                console.log("Error:" + err + ":" + obj.title);
              });
            db.Article.create(obj, function(err, res) {
              successfullyScrapedPage = true;
              if (err) {
                console.log("Judy Error: " + err);
              }
            });
          }
          if (successfullyScrapedPage) {
            // Return if a page has been scraped
            return;
          }
        });
      }
      res.redirect("/");
    });
  });
  // save article
  app.post("/api/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
  // unsave article
  app.post("/api/unsave/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
      .then(() => {
        res.redirect("/saved");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
  // delete saved
  app.post("/api/delete/:id", function(req, res) {
    db.Article.deleteOne({ _id: req.params.id })
      .then(() => {
        res.redirect("/saved");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
  // add a comment
  app.post("/api/comment/:id", function(req, res) {
    db.Comment.create(
      {
        body: req.body.comment,
        article: req.params.id
      },
      function(err, comment) {
        // Log any errors
        if (err) {
          console.log(err);
        } else {
          console.log(comment);
          // Otherwise
          db.Article.findOneAndUpdate(
            { _id: req.params.id },
            { comment: comment }
          ) //push to the notes array
            .then(() => {
              res.redirect("/saved");
            })
            .catch(err => {
              console.log("Error: " + err);
            });
        }
      }
    );
  });
  //
  app.get("/api/getComment/:id", function(req, res) {
    db.Comment.findById(req.params.id).then(comment => {
      res.json(comment);
    });
  });
  app.get("/api/getComment/", function(req, res) {
    // No comments
    res.json({ body: "" });
  });
  // delete comment
  app.post("/api/deleteComment/:id", function(req, res) {
    db.Comment.findByIdAndDelete({ _id: req.params.id })
      .then(() => {
        res.redirect("/saved");
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  });
};
