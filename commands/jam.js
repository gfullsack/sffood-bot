const ytdl = require('ytdl-core');
const messages = require('../messages.json');

module.exports = {
	name: 'jam',
	description: 'Get pumped with some music from Vergils exclusive playlist.',
	execute(msg, args) {
		let dispatcher;

		if (dispatcher === undefined) {
			if (msg.channel.type !== 'text') return;
			const { voiceChannel } = msg.member;
			if (!voiceChannel) {
				return msg.reply('please join a voice channel first!');
			}
			voiceChannel.join().then(connection => {
				msg.reply('NOW IM MOTIVATED!');
				let stream = ytdl(
					messages.motivation_playlist[Math.floor(Math.random() * messages.motivation_playlist.length)],
					{ filter: 'audioonly' }
				);
				if (args[0] === 'radio') {
					console.log('Play some chill radio');
					stream = ytdl(messages.radio_stations[Math.floor(Math.random() * messages.radio_stations.length)], {
						filter: 'audioonly',
					});
				}
				dispatcher = connection.playStream(stream);
				dispatcher.on('end', () => voiceChannel.leave());
			});
		} else {
            dispatcher.end;
            return msg.reply("Party's over people");
		}
	},
};
