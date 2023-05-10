const { ActivityType } = require('discord.js');
const { loadCommands } = require('../../Handlers/handleCommands');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const statusArray = [
			{
				type: ActivityType.Playing,
				name: 'with some fairies',
			},
			{
				type: ActivityType.Watching,
				name: 'Penny do research',
			},
			{
				type: ActivityType.Listening,
				name: 'convos about magic',
			},
		];
		async function pickActivity() {
			const option = Math.floor(Math.random() * statusArray.length);

			try {
				await client.user.setActivity(statusArray[option]);
			}
			catch (error) {
				console.error(error);
			}
		}
		setInterval(pickActivity, 15 * 1000);

		loadCommands(client);
		console.log(`Raring to go! Logged in as ${client.user.username}`);

	},
};
