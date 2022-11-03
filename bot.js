require('dotenv').config()

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


client.on('ready', () => {


console.log('Our Bot is Ready')
client.user.setActivity('Eddie is a faggot', {type: "WATCHING"});

});

client.on('messageCreate', (message) => {
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
    if(command === "test"){
        message.channel.send("bot is working")
    }
    if(command === "test"){
        message.channel.send("bot is working")
    }
    if (message.content === 'I Love Papaya') {
        message.channel.send("Me Too 🤍!!!!")
      }
    if (message.content.toLowerCase().includes('eddie')) {
        message.reply('he smelli')
      }



})




client.login(process.env.BOT_TOKEN);