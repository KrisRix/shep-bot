module.exports = {
	data: {
		name: 'danger-button',
	},
	async execute(interaction) {
		await interaction.reply('Colour Danger: #xxxxxx');
	},
};