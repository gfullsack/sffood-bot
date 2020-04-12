const messages = require('../messages.json');

module.exports = {
	name: 'tip',
	description: 'Get a helpful tip from Vergil.',
	execute(msg, args) {
		msg.reply(messages.life_lessons[Math.floor(Math.random() * messages.life_lessons.length)]);
	},
};
