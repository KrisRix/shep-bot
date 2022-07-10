const { SlashCommandBuilder } = require('@discordjs/builders');
const welcomeSchema = require('../../schemas/welcome-schema');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configuration')
		.setDescription('Sets the welcome channel.')
		.addChannelOption(option => option
			.setName('target')
			.setDescription('The channel where the welcome message is posted.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('message')
			.setDescription('The welcome message')
			.setRequired(true)),
	permissions: [ Permissions.FLAGS.MANAGE_GUILD ],
	async execute(interaction) {
		const target = interaction.options.getChannel('target');
		const text = interaction.options.getString('message');
		// Check if channel is a text channel
		if (target.type !== 'GUILD_TEXT') {
			await interaction.reply({
				content: 'You have to specify a text channel.',
				ephemeral: true });
		}
		else {
			await interaction.reply(`Your welcome message is: ${text}`);
		}
		// Update database
		await welcomeSchema.findOneAndUpdate({
			_id: interaction.guild.id,
		},
		{
			_id: interaction.guild.id,
			text,
			channelId: target.id,
		}, {
			upsert: true,
		});
		// Confirmation message
		await interaction.reply('Welcome channel set!');
	},
};