module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const statusArray = [
			{
				type: 'PLAYING',
				content: 'with some fairies',
				status: 'dnd',
			},
			{
				type: 'WATCHING',
				content: 'Penny do research',
				status: 'idle',
			},
			{
				type: 'LISTENING',
				content: 'convos about magic',
				status: 'online',
			},
		];
		async function pickPresence() {
			const option = Math.floor(Math.random() * statusArray.length);

			try {
				await client.user.setPresence({
					activities: [
						{
							name: statusArray[option].content,
							type: statusArray[option].type,
						},
					],
					status: statusArray[option].status,
				});
			}
			catch (error) {
				console.error(error);
			}
		}
		setInterval(pickPresence, 15 * 1000);
		console.log(`Raring to go! Logged in as ${client.user.tag}`);
	},
};