module.exports = {
	data: {
		name: 'cancel-button',
	},
	async execute(interaction) {
		await interaction.reply('Profile setup cancelled.');
	},
};