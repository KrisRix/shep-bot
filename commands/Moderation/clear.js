const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const transcripts = require('discord-html-transcripts');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear a specific amount of messages from this channel')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(options => options
			.setName('amount')
			.setDescription('How many messages you want to delete')
			.setMinValue(1)
			.setMaxValue(99)
			.setRequired(true),
		)
		.addStringOption(options => options
			.setName('reason')
			.setDescription('The reason for the deletion')
			.setRequired(true),
		)
		.addUserOption(options => options
			.setName('target')
			.setDescription('Select a user to clear only their messages')
			.setRequired(false),
		),

	async execute(interaction) {
		const { channel, options } = interaction;

		const amount = options.getInteger('amount');
		const target = options.getUser('target');
		const reason = options.getString('reason');

		const channelMessages = await channel.messages.fetch();

		// TO ADD: a log channel for the response
		const logChannel = false;
		// interaction.guild.channels.cache.get(CHANNEL_ID_HERE);

		const response = new EmbedBuilder()
			.setColor(0x5fb041);
		const logEmbed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: 'CLEAR COMMAND USED' });

		const logEmbedDescription = [
			`⁙ Moderator: ${interaction.member}`,
			`⁙ Target: ${target || 'None'}`,
			`⁙ Channel: ${interaction.channel}`,
			`⁙ Reason: ${reason}`,
		];

		try {
			if (target) {
				let i = 0;
				const filtered = [];

				channelMessages.filter((msg) => {
					if (msg.author.id === target.id && amount > i) {
						filtered.push(msg);
						i++;
					}
				});

				const transcript = await transcripts.generateFromMessages(filtered, channel);

				await channel.bulkDelete(filtered).then(async (messages) => {
					logEmbedDescription.push(`⁙ Amount deleted: ${messages.size}`);

					if (logChannel) {
						logChannel.send({
							embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
							files: [transcript],
						});
					}
					else {
						try {
							await interaction.member.send({
								embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
								files: [transcript],
							});
							response.setDescription(`Successfully deleted ${messages.size} message(s) from ${target}. The transcript has been DMed to you.`);
							interaction.reply({ embeds: [response], ephemeral: true });
						}
						catch (error) {
							response.setDescription(`Successfully deleted ${messages.size} message(s) from ${target}.\n
								⚠️ __**Important:**__ ⚠️
								I couldn't DM you, so the transcript is attached here.
								This message will disappear when the channel refreshes, so be sure to download the transcript right now if you want to keep it!`,
							);
							interaction.reply({ embeds: [response], files: [transcript], ephemeral: true });
						}
					}
				});
			}
			else {
				const transcript = await transcripts.createTranscript(channel, { limit: amount });

				await channel.bulkDelete(amount, true).then(async (messages) => {
					logEmbedDescription.push(`⁙ Amount deleted: ${messages.size}`);
					response.setDescription(`Successfully deleted ${messages.size} message(s) from the channel.`);

					if (logChannel) {
						logChannel.send({
							embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
							files: [transcript],
						});
					}
					else {
						try {
							await interaction.member.send({
								embeds: [logEmbed.setDescription(logEmbedDescription.join('\n'))],
								files: [transcript],
							});
							response.setDescription(`Successfully deleted ${messages.size} message(s) from this channel. The transcript has been DMed to you.`);
							interaction.reply({ embeds: [response], ephemeral: true });
						}
						catch (error) {
							response.setDescription(`Successfully deleted ${messages.size} message(s) from this channel.\n
								⚠️ __**Important:**__ ⚠️
								I couldn't DM you, so the transcript is attached here.
								This message will disappear when the channel refreshes, so be sure to download the transcript right now if you want to keep it!`,
							);
							interaction.reply({ embeds: [response], files: [transcript], ephemeral: true });
						}
					}
				});
			}
		}
		// If bot can't manage messages...
		catch (error) {
			if (error.code == 50013) {
				await interaction.reply('Sorry, pal, I don\'t have the permission `MANAGE MESSAGES`.');
			}
			else {
				console.error('Failed to clear message(s):', error);
			}
		}

	},

};