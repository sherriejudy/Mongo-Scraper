var db = require("../models");

module.exports = function(app) {
  // your scraping code goes here
  app.get("/", function(req, res) {
    res.render("index");
  });
  // Load index page
  app.get("/home", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(data) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(data);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
};
