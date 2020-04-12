const Discord = require('discord.js');
const fs = require('fs');
const messages = require('./messages.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (!msg.content.startsWith(messages.prefix) || msg.author.bot) return;

	const args = msg.content.slice(messages.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute the command!');
	}

	// Passive actions based on general user input
	if (messages.known_scum.some(word => msg.content.includes(word))) {
		msg.reply('Scum!');
	}
});

try {
	const config = require('./config.js');
	client.login(config.discord_token);
} catch (e) {
	client.login(process.env.BOT_TOKEN);
}
