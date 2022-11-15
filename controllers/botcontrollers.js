const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const { querySplitter } = require("../methods");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");


module.exports = {

// Delete Movie
  deleteMovie: function(message) {
    const movieQuery = querySplitter(message.content, 13);

    Movie.findOneAndDelete({ title: movieQuery }, (err, docs) => {
      if (err) {
        console.log(err);
      } else if (!docs) {
        message.reply(`${movieQuery} does not exist in the list`);
        console.log("Deleted Movie : ", docs);
      } else {
        message.reply(`${movieQuery} has been deleted from the list`);
      }
    });
  },
// Add Movie
  addMovie: async function (message) {
    const arr = message.content.split("!");
    console.log(arr[1], arr[2]);
    const movieTitle = arr[1]
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const movie = new Movie({ title: movieTitle, link: arr[2] });
    try {
      await movie.save();
      message.reply(`${movieTitle} has been added to the list`);
    } catch (error) {
      console.log(error);
      message.reply(`${movieTitle} is already on the list`);
    }
  },
// Get 1 Movie
  getMovie: async function (message) {
    const movies = await Movie.find();
    const { title, link } = movies[Math.floor(Math.random() * movies.length)];
    const res = await axios.get(
      `https://www.omdbapi.com/?t=${title}&apikey=272fc884`
    );
    console.log(res.data);

    const movieEmbed = new EmbedBuilder()
      .setColor(0x20124d)
      .setTitle(title || "N/A")
      .setDescription(res.data.Plot || "N/A")
      .setImage(res.data.Poster || null)
      .addFields(
        { name: "Year", value: res.data.Year || "N/A", inline: true },
        { name: "Director", value: res.data.Director || "N/A", inline: true },
        { name: "Language", value: res.data.Language || "N/A", inline: true },
        { name: "Runtime", value: res.data.Runtime || "N/A", inline: true }
      )
      .setURL(link || null);

    message.channel.send({ embeds: [movieEmbed] });
  },
  // Get 5 Movies
  getFive: async function (message) {
    try {
      const movies = await Movie.find();

      Array(5)
        .fill()
        .forEach(async (loop) => {
          const { title, link } =
            movies[Math.floor(Math.random() * movies.length)];
          const res = await axios.get(
            `https://www.omdbapi.com/?t=${title}&apikey=272fc884`
          );

          const movieEmbed = new EmbedBuilder()
            .setColor(0x20124d)
            .setTitle(title || "N/A")
            .setDescription(res.data.Plot || "N/A")
            .setImage(res.data.Poster || null)
            .addFields(
              { name: "Year", value: res.data.Year || "N/A", inline: true },
              {
                name: "Director",
                value: res.data.Director || "N/A",
                inline: true,
              },
              {
                name: "Language",
                value: res.data.Language || "N/A",
                inline: true,
              },
              {
                name: "Runtime",
                value: res.data.Runtime || "N/A",
                inline: true,
              }
            )
            .setURL(link || null);

          message.channel.send({ embeds: [movieEmbed] });
        });
    } catch (error) {
      console.log(error);
    }
  },


  // Search for Movie
  searchMovie: async function (message) {
    const movieQuery = querySplitter(message.content, 13);
    console.log(movieQuery);
    try {
      const movie = await Movie.find({ title: movieQuery });
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${movie[0].title}&apikey=272fc884`
      );
      console.log(res.data);
      const movieEmbed = new EmbedBuilder()
        .setColor(0x20124d)
        .setTitle(movie[0].title || "N/A")
        .setDescription(res.data.Plot || "N/A")
        .setImage(res.data.Poster || null)
        .addFields(
          { name: "Year", value: res.data.Year || "N/A", inline: true },
          { name: "Director", value: res.data.Director || "N/A", inline: true },
          { name: "Language", value: res.data.Language || "N/A", inline: true },
          { name: "Runtime", value: res.data.Runtime || "N/A", inline: true }
        )
        .setURL(movie[0].link || null);

      message.channel.send({ embeds: [movieEmbed] });
    } catch (error) {
      console.log(error);
      message.channel.send(`Could not find __**${movieQuery}**__ in the list`);
    }
  },


  // Get the total number of Movies
  countMovies: async function (message) {
    try {
      const count = await Movie.countDocuments();
      message.reply(count.toString());
    } catch (error) {
      console.log(error);
    }
  },

  // Update Movie Link
  updateLink: async function (message) {
    const arr = message.content.split("!");
    console.log(arr[1], arr[2]);
    const movieTitle = titleCase(arr[1]);
    try {
      const movies = await Movie.findOneAndUpdate(
        { title: movieTitle },
        { link: arr[2] }
      );
      message.reply(`The link for __**${movieTitle}**__ has been updated`);
    } catch (error) {
      console.log(error);
    }
  },

  // Update Movie Title
  updateTitle: async function (message) {
    const arr = message.content.split("!");
    const movieQuery = titleCase(arr[1]);
    const titleUpdate = titleCase(arr[2]);
    try {
      const movies = await Movie.findOneAndUpdate(
        { title: movieQuery },
        { title: titleUpdate }
      );
      message.reply(
        `The title for __**${movieQuery}**__ has been updated to __**${titleUpdate}**__`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
