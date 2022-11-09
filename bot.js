const mongoose = require("mongoose");
const Movie = require("./db");
const axios = require("axios");
const titleCase = require("./methods");
require("dotenv").config();

mongoose.connect(process.env.MONGO_KEY);

const {
  Client,
  Intents,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");

const prefix = "<";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", async () => {
  console.log("Bot is Ready");
  client.user.setActivity("Eddie is a faggot", { type: "WATCHING" });
});

client.on("messageCreate", async (message) => {
  // if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const messageArray = message.content.split(" ");
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  // Deprecated format to add movie to DB
  if (command.includes("sendmovie")) {
    const movieRec = message.content
      .substring(11)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const movie = new Movie({ title: movieRec });
    await movie.save();
    message.reply(`${movieRec} has been added to the list`);
  }

  // Delete movie from the DB
  if (command.includes("deletemovie")) {
    const movieQuery = message.content
      .substring(13)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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
  }

  // add a movie to the DB w/ movie link
  if (command.includes("sendreclink!")) {
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
  }

  // Get five random movies
  if (command.includes("getfive")) {
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
              }
            )
            .setURL(link || null);

          message.channel.send({ embeds: [movieEmbed] });
        });
    } catch (error) {
      console.log(error);
    }
  }

  // Getr a movie recomendation
  if (command.includes("getrec")) {
    const movies = await Movie.find();
    const { title, link } = movies[Math.floor(Math.random() * movies.length)];
    const res = await axios.get(
      `https://www.omdbapi.com/?t=${title}&apikey=272fc884`
    );
    console.log(res.data);

    const movieEmbed = new EmbedBuilder()
      .setColor(0x20124d)
      .setTitle(title)
      .setDescription(res.data.Plot)
      .setImage(res.data.Poster)
      .addFields(
        { name: "Year", value: res.data.Year, inline: true },
        { name: "Director", value: res.data.Director, inline: true },
        { name: "Language", value: res.data.Language, inline: true }
      )
      .setURL(link || null);

    message.channel.send({ embeds: [movieEmbed] });
  }
  if (command.includes("getallmovies")) {
    let list = "";
    //this algo sorts the list alphabetically by title
    const movies = await Movie.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 });
    movies.forEach(
      (movie) => (list += movie.title + "\n" + "Link: " + movie.link + "\n\n")
    );
    message.channel.send(list);
  }

  // Search for a movie
  if (command.includes("searchmovie")) {
    const movieQuery = message.content
      .substring(13)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    try {
      const movie = await Movie.find({ title: movieQuery });
      const res = await axios.get(
        `https://www.omdbapi.com/?t=${movie[0].title}&apikey=272fc884`
      );

      const movieEmbed = new EmbedBuilder()
        .setColor(0x20124d)
        .setTitle(movie[0].title)
        .setDescription(res.data.Plot)
        .setImage(res.data.Poster)
        .addFields(
          { name: "Year", value: res.data.Year, inline: true },
          { name: "Director", value: res.data.Director, inline: true },
          { name: "Language", value: res.data.Language, inline: true }
        )
        .setURL(movie[0].link || null);

      message.channel.send({ embeds: [movieEmbed] });
    } catch (error) {
      console.log(error);
      message.channel.send(`Could not find __**${movieQuery}**__ in the list`);
    }
  }

  // Get the count of movies in th DB
  if (command.includes("moviecount")) {
    try {
      const count = await Movie.countDocuments();
      message.reply(count.toString());
    } catch (error) {
      console.log(error);
    }
  }
// Update link 
  if (command.includes("updatelink!")) {
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
  }
  //Update title
  if (command.includes("updatetitle!")) {
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
  }
});

client.login(process.env.BOT_TOKEN);
