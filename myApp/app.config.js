// app.config.js
require('dotenv').config();

module.exports = {
  expo: {
    name: "myApp",
    slug: "myApp",
    version: "1.0.0",
    extra: {
      WORLD_NEWS_API_KEY: process.env.WORLD_NEWS_API_KEY,
    },
  },
};
