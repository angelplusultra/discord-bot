const mongoose = require("mongoose");
const Movie = require("./db");
const axios = require("axios");
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

  // <sendreclink! Movie Title !Movie Link
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
    let list = ''
    //this algo sorts the list alphabetically by title
    const movies = await Movie.find().collation({locale: 'en', strength: 2}).sort({title: 1});
    movies.forEach(
      (movie) => (list += movie.title + "\n" + "Link: " + movie.link + "\n\n")
    );
    message.channel.send(list);
  }
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

});

client.login(process.env.BOT_TOKEN);
