const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hex')
		.setDescription('Displays Discord hex colour codes.'),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('danger-button')
					.setLabel('Danger')
					.setStyle('DANGER'),
				new MessageButton()
					.setCustomId('success-button')
					.setLabel('Success')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('primary-button')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({
			content: 'Select button to get colours.',
			ephemeral: true,
			components: [row] });
	},
};