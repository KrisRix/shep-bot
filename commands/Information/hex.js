const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hex')
		.setDescription('Displays Discord hex colour codes.'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('danger-button')
					.setLabel('Danger')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('success-button')
					.setLabel('Success')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('primary-button')
					.setLabel('Primary')
					.setStyle(ButtonStyle.Primary),
			);
		await interaction.reply({
			content: 'Select button to get colours.',
			ephemeral: true,
			components: [row] });
	},
};