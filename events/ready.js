module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Raring to go! Logged in as ${client.user.tag}`);
	},
};