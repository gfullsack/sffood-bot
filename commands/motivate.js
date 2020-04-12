const messages = require('../messages.json');

module.exports = {
	name: 'motivate',
	description: 'Get motivated with an exclusive quote from Vergil.',
	execute(msg, args) {
		msg.reply(messages.discord_responses[Math.floor(Math.random() * messages.discord_responses.length)]);
	},
};
