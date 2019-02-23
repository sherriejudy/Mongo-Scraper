# Mongo-Scraper
*Burgers* is deployed to Heroku. Please check it out [here](https://mongo-scraper11.herokuapp.com/)

## Overview
An app that scrapes articles using Mongoose and Cheerio from a news publication and lets users save articles and leave comments on the latest news. The Newspaper is University of Toronto's Independent publication, with a new [Wordpress Website] (https://thenewspaper.ca/) Project implemented by Judy Hu, 2019. 

## How It Works
- Scrape articles by clicking the "Scrape Articles" button.
- Once articles are loaded, read full article by clicking the link in each article's panel and save articles by clicking the "Save Article" button.
- Saved articles can be viewed at the "Saved Articles" page.
- Comments can be added on saved articles by clicking the "Add a Note" button.
- Saved articles can be deleted by clicking the "Delete" button.

## Technologies Used
- MongoDB
- Node.js
- Express.js
- Handlebars.js
- Mongoose
- npm packages (
    - body-parser
    - express
    - express-handlebars
    - mongoose
    - cheerio
    - request
