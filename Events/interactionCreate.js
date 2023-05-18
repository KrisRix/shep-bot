const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction, client) {

		// If interaction is a command...
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			// If command is outdated...
			if (!command) {
				await interaction.reply({
					content: 'This command doesn\'t exist anymore.',
					ephemeral: true,
				});
				console.error(`No command matching ${interaction.commandName} was found`);
				return;
			}

			// If command is only for developer...
			if (command.developer && interaction.user.id !== process.env.devId) {
				return await interaction.reply({
					content: 'This command is only available to my developer.',
					ephemeral: true,
				});
			}

			// Try to run command...
			try {
				await command.execute(interaction, client);
			}
			catch (error) {
				console.error(`Error executing command: ${interaction.commandName}`);
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'Ope! There was an error while executing this command.', ephemeral: true });
				}
				else {
					await interaction.reply({ content: 'Ope! There was an error while executing this command.', ephemeral: true });
				}
			}
		}

		// If interaction is a button...
		else if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);

			// If button is outdated...
			if (!button) {
				await interaction.reply({ content: 'Sorry, pal, there was no button code found for this button.' });
				console.error(`No button matching ${interaction.customId} was found`);
				return;
			}

			// Try to run button...
			try {
				await button.execute(interaction, client);
			}
			catch (error) {
				await interaction.reply({
					content: 'Ope! There was an error while executing this button.',
					ephemeral: true,
				});
				console.error(`Error executing button: ${interaction.customId}`);
				console.error(error);
			}
		}

	},
};