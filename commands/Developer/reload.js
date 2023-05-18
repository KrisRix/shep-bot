const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { loadEvents } = require('../../Handlers/handleEvents');
const { loadCommands } = require('../../Handlers/handleCommands');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads commands or events.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((options) => options
			.setName('events')
			.setDescription('Reload events'))
		.addSubcommand((options) => options
			.setName('commands')
			.setDescription('Reload commands')),

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }).catch((error) => console.log(error));

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
		case 'events' : {
			for (const [key, value] of client.events) {
				client.removeListener(`${key}`, value, true);
			}
			loadEvents(client);
			await interaction.editReply({ content: 'Reloaded events!' });
		}
			break;
		case 'commands' : {
			loadCommands(client);
			await interaction.editReply({ content: 'Reloaded commands!' });
		}
			break;
		}
	},
};
