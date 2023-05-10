// eslint-disable-next-line no-unused-vars
const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) {
			return interaction.reply({
				content: 'This command is outdated',
				ephemeral: true,
			});
		}

		if (command.developer && interaction.user.id !== process.env.devId) {
			return interaction.reply({
				content: 'This command is only available to my developer.',
				ephemeral: true,
			});
		}

		command.execute(interaction, client);
	},
};