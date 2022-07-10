module.exports = {
	data: {
		name: 'success-button',
	},
	async execute(interaction) {
		await interaction.reply('Colour Success: #xxxxxx');
	},
};