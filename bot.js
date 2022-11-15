//Imports
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const axios = require("axios");
const connectDB = require("./config/db");
const { titleCase, querySplitter } = require("./methods");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  CommandInteractionOptionResolver,
} = require("discord.js");
const botController = require("./controllers/botcontrollers");
require("dotenv").config({ path: "./config/.env" });

// DB Connection
connectDB();

//Prefix Config
const prefix = "<";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Bot on Ready
client.on("ready", async () => {
  console.log("Bot is Ready");
  client.user.setActivity("Eddie is a faggot", { type: "WATCHING" });
});

// Bot Routes
client.on("messageCreate",  (message) => {
  // if(!message.content.startsWith(prefix) || message.author.bot) return;


  //Logic to obtain the command
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();



  // Routes
  // Delete movie from the DB
  if (command.includes("deletemovie")) {
    botController.deleteMovie(message);
  }

  // add a movie to the DB w/ movie link
  if (command.includes("sendreclink!")) {
    botController.addMovie(message);
  }

  // Get five random movies
  if (command.includes("getfive")) {
    botController.getFive(message);
  }

  // Get a movie recomendation
  if (command.includes("getrec")) {
    botController.getMovie(message);
  }
  if (command.includes("getallmovies")) {
    message.channel.send("https://movie-emporium.onrender.com");
  }

  // Search for a movie
  if (command.includes("searchmovie")) {
    botController.searchMovie(message);
  }

  // Get the count of movies in th DB
  if (command.includes("moviecount")) {
    botController.countMovies(message);
  }
  // Update link
  if (command.includes("updatelink!")) {
    botController.updateLink(message);
  }

  //Update title
  if (command.includes("updatetitle!")) {
    botController.updateTitle(message);
  }
});

client.login(process.env.BOT_TOKEN);
