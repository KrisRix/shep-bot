const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks member'),
	permissions: [ Permissions.FLAGS.KICK_MEMBERS ],
	async execute(interaction) {
		await interaction.reply('This command works.');
	},
};
