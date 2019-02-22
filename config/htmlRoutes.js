var db = require("../models");

module.exports = function(app) {
  // your scraping code goes here
  // Load index page
  app.get("/", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ saved: false })
      .then(function(data) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", {
          msg: "test",
          article: data
        });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Load index page
  app.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ saved: true })
      .then(function(articles) {
        // If we were able to successfully find Articles, send them back to the client
        db.Comment.find({}).then(comments => {
          for (var j = 0; j < articles.length; j++) {
            for (var i = 0; i < comments.length; i++) {
              if (articles[j].comment == comments[i]._id) {
                articles[j].commentObject = comments[i];
              }
            }
          }
          console.log(articles);
          // console.log(comments);
          res.render("saved", {
            article: articles
          });
        });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbComment._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Create a new note
  app.post("/comments/save/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    var newComment = new Comment({
      comment: req.comment.text,
      article: req.params.id
    });
    // And save the new comment the db
    newComment.save(function(error, comment) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's notes
        Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comment: comment } }
        )
          // Execute the above query
          .exec(function(err) {
            // Log any errors
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // Or send the note to the browser
              res.send(comment);
            }
          });
      }
    });
  });
};
