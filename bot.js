const mongoose = require('mongoose');
const Movie = require('./db')
const axios = require('axios')
require('dotenv').config()

mongoose.connect(process.env.MONGO_KEY)


const { Client, Intents, GatewayIntentBits } = require('discord.js');



const prefix = '<'
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});


client.on('ready', async () => {


console.log('Our Bot is Ready')
client.user.setActivity('Eddie is a faggot', {type: "WATCHING"});



});

client.on('messageCreate', async (message) => {
    // if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const messageArray = message.content.split(' ')
    const argument = messageArray.slice(1)
    const cmd = messageArray[0]


    if(command === "test"){
        message.channel.send("bot is working")
    }
    if(command === "eddie"){
        message.channel.send("You're a lazy piece of shit, Eddie!")
    }
    if (message.content === 'I Love Papaya') {
        message.channel.send("Me Too 🤍!!!!")
      }
    if (message.content.toLowerCase().includes('eddie')) {
        message.reply('he smelli')
      }
      if(command.includes('sendrec')){
        const movieRec = message.content.substring(9).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            const movie = new Movie({title: movieRec})
            movie.save()
            message.reply(`${movieRec} has been added to the list`)
      }
      if(command.includes('getrec')){
        const movies = await Movie.find()
        
        const rec = movies[Math.floor(Math.random() * movies.length)].title
        const res = await axios.get(`https://www.omdbapi.com/?t=${rec}&apikey=272fc884`)
        console.log(res.data)


        message.channel.send({content: rec, files: [res.data.Poster]})
            
          
    
      }


      // Get whole list of movies
//       if(command.includes('movielist')){
//         const moviesList = await Movie.find()
//         message.channel.send(moviesList.map(movie => movie.title).join(','))
//   }
  



})




client.login(process.env.BOT_TOKEN);