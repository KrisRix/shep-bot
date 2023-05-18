const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle } = require('discord.js');
// const profileSchema = require('../../schemas/profile-schema');


const pronounsList = ['941035999339872337'];


module.exports = {
	data: new SlashCommandBuilder()
		.setName('profilebwoo')
		.setDescription('Sets a member\'s profile.'),

	async execute(interaction, client) {
		// First message: setting socials
		const socialModal = new ModalBuilder()
			.setCustomId('socials')
			.setTitle(`${interaction.user.username}'s Socials`);
		const ao3Input = new TextInputBuilder()
			.setCustomId('ao3')
			.setLabel('Link to your AO3 account')
			.setStyle(TextInputStyle.Short);
		const tumblrInput = new TextInputBuilder()
			.setCustomId('tumblr')
			.setLabel('Tumblr username')
			.setStyle(TextInputStyle.Short);
		const twitterInput = new TextInputBuilder()
			.setCustomId('twitter')
			.setLabel('Twitter username')
			.setStyle(TextInputStyle.Short);
		const instagramInput = new TextInputBuilder()
			.setCustomId('instagram')
			.setLabel('Instagram')
			.setStyle(TextInputStyle.Short);
		const goodreadsInput = new TextInputBuilder()
			.setCustomId('goodreads')
			.setLabel('Link to your Goodreads page')
			.setStyle(TextInputStyle.Short);
		const ao3Row = new ActionRowBuilder().addComponents(ao3Input);
		const tumblrRow = new ActionRowBuilder().addComponents(tumblrInput);
		const twitterRow = new ActionRowBuilder().addComponents(twitterInput);
		const instagramRow = new ActionRowBuilder().addComponents(instagramInput);
		const goodreadsRow = new ActionRowBuilder().addComponents(goodreadsInput);

		socialModal.addComponents(ao3Row, tumblrRow, twitterRow, instagramRow, goodreadsRow);

		await interaction.showModal(socialModal);

		const filterModal = i => i.user.id === interaction.user.id;

		const collectorModal = interaction.channel.createMessageComponentcollectorButton({ filterModal, time: 15000 });

		collectorModal.on('collect', async i => {
			if (i.customId === 'socials') {
				const ao3 = interaction.fields.getTextInputValue('ao3') ? interaction.fields.getTextInputValue('ao3').trim() : 'N/A';
				const tumblr = interaction.fields.getTextInputValue('tumblr') ? interaction.fields.getTextInputValue('tumblr').trim() : 'N/A';
				const twitter = interaction.fields.getTextInputValue('twitter') ? interaction.fields.getTextInputValue('twitter').trim() : 'N/A';
				const instagram = interaction.fields.getTextInputValue('instagram') ? interaction.fields.getTextInputValue('instagram').trim() : 'N/A';
				const goodreads = interaction.fields.getTextInputValue('goodreads') ? interaction.fields.getTextInputValue('goodreads').trim() : 'N/A';

				await interaction.reply({
					content: `You entered: /n${ao3}, /n${tumblr}, /n${twitter}, /n${instagram}, /n${goodreads},`,
					ephemeral: true,
				});
			}
		});

		// Second message: setting age
		let age;
		const ageRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('adult')
					.setLabel('Adult')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('minor')
					.setLabel('Minor')
					.setStyle(ButtonStyle.Danger),
			);
		await interaction.followUp({
			content: 'Now let\'s set your age category!/n/nAre you an adult (18+) or a minor (under 18)?',
			ephemeral: true,
			components: [ageRow] });

		const filterButton = i => i.user.id === interaction.user.id;

		const collectorButton = interaction.channel.createMessageComponentcollectorButton({ filterButton, time: 15000 });

		collectorButton.on('collect', async i => {
			if (i.customId === 'adult') {
				await i.update({ content: 'Age set to: adult (18+)', components: [] });
				age = 'adult';
			}
			else if (i.customId === 'minor') {
				await i.update({
					content: 'Age set to: minor (under 18)',
					components: [],
				});
				age = 'minor';
			}
		});

		// Find pronouns role
		let memberPronouns = interaction.member.roles.cache.find(role => pronounsList.includes(role.id));
		if (!memberPronouns) {
			memberPronouns = 'Not assigned';
		}

		// Embed with all entered info
		await interaction.user.fetch();
		const member = await interaction.member.fetch();
		const profileEmbed = new EmbedBuilder()
			.setTitle(`${interaction.user.username}'s Profile`)
			.setThumbnail(member.displayAvatarURL())
			.addFields(
				{
					name: 'Username:',
					value: `${interaction.user.username}`,
					inline: true,
				},
				{ name: '\u200B', value: '\u200B', inline: true },
				{
					name: 'Member since:',
					value: `${member.joinedAt.toDateString()}`,
					inline: true,
				},
			)
			.addFields(
				{ name: 'Pronouns:', value: `${memberPronouns}`, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Age:', value: `${age}`, inline: true },
			)
			.addFields(
				{
					name: '<:social_ao3:747580432522149979> AO3',
					value: `[${ao3}](${ao3})`,
					inline: true,
				},
				{
					name: '<:social_tumblr:796411846575652864> Tumblr',
					value: `[${tumblr}](https://${tumblr}.tumblr.com)`,
					inline: true,
				},
				{
					name: '<:social_twitter:796411914145234944> Twitter',
					value: `[${twitter}](https://twitter.com/${twitter})`,
					inline: true,
				},
				{
					name: '<:social_instagram:796412284120727572> Instagram',
					value: `[${instagram}](https://instagram.com/${instagram})`,
					inline: true,
				},
				{
					name: '<:social_goodreads:796473004632178698> Goodreads',
					value: `[${goodreads}](${goodreads})`,
					inline: true,
				},
			)
			.setImage(interaction.user.bannerURL({ dynamic: true, size: 1024 }))
			.setTimestamp()
			.setColor(interaction.user.accentColor)
			.setFooter({
				text: `${client.user.tag}`,
				iconURL: `${client.user.displayAvatarURL()}`,
			});

		// Message to confirm input
		const finalizeRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('confirmProfile')
				.setLabel('Confirm')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('cancelProfile')
				.setLabel('Cancel')
				.setStyle(ButtonStyle.Danger),
		);
		await interaction.followUp({
			content: '_*Here\'s the info I\'ve got about you:*_',
			ephemeral: true,
			embeds: [profileEmbed],
			components: [finalizeRow],
		});
	},
};