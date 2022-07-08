const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get some info.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Get info about a fellow server member.')
				.addUserOption(option => option.setName('target').setDescription('The member you want info on.')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Get info about this server.')),
	async execute(interaction, client) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = await interaction.options.getUser('target').fetch(true);
			if (user) {
				const userEmbed = new MessageEmbed()
					.setTitle(`${user.username}'s Information`)
					.setDescription(`Here's the low-down on <@${user.id}>`)
					.setThumbnail(user.displayAvatarURL())
					.addFields(
						{ name: 'Username:', value: `${user.username}`, inline: true },
						{ name: '\u200B', value: '\u200B', inline: true },
						{ name: 'Joined:', value: `${user.joinedAt}`, inline: true },
					)
					.setImage(user.bannerURL({ dynamic: true, size: 1024 }))
					.setTimestamp()
					.setColor(user.accentColor)
					.setFooter({ text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` });

				await interaction.reply({ embeds: [userEmbed] });
			}
			else {
				await interaction.reply(`Username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		}
		else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server Name: ${interaction.guild.name}\nTotal Members: ${interaction.guild.memberCount}`);
		}
		else {
			await interaction.reply('You didn\'t give me enough to go on, bud.');
		}
	},
};