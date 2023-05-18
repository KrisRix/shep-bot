const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with "Pong!" and latency info'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Pongers!\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};