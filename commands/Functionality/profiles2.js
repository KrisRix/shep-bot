const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require('discord.js');
const profileSchema = require('../../schemas/profile-schema');

const pronounsList = ['941035999339872337'];
let ao3
let tumblr
let twitter
let instagram
let goodreads

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profilenew')
		.setDescription('Sets a member\'s profile.'),

	async execute(interaction) {
		// First message: setting age
		const ageRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('adult')
					.setLabel('Adult')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('minor')
					.setLabel('Minor')
					.setStyle('DANGER'),
			);
		await interaction.reply({
			content: 'Are you an adult or a minor?',
			ephemeral: true,
			components: [ageRow] });

		const filter = i => i.user.id === interaction.user.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async i => {
			if (i.customId === 'adult') {
				await i.update({ content: 'Age: adult', components: [] });
			}
			else if (i.customId === 'minor') {
				await i.update({ content: 'Age: minor', components: [] });
			}

			// Next message: setting socials
			const socialModal = new Modal()
				.setCustomId('socials')
				.setTitle(`${interaction.user.id}'s Socials`);
			const ao3Input = new TextInputComponent()
				.setCustomId('ao3')
				.setLabel('Link your AO3 account')
				.setStyle('SHORT');
			const tumblrInput = new TextInputComponent()
				.setCustomId('tumblr')
				.setLabel('Tumblr username')
				.setStyle('SHORT');
			const twitterInput = new TextInputComponent()
				.setCustomId('twitter')
				.setLabel('Twitter username')
				.setStyle('SHORT');
			const instagramInput = new TextInputComponent()
				.setCustomId('instagram')
				.setLabel('Instagram')
				.setStyle('SHORT');
			const goodreadsInput = new MessageButton()
				.setCustomId('Goodreads')
				.setLabel('Link your Goodreads page')
				.setStyle('SHORT');
			const ao3Row = new MessageActionRow().addComponents(ao3Input);
			const tumblrRow = new MessageActionRow().addComponents(tumblrInput);
			const twitterRow = new MessageActionRow().addComponents(twitterInput);
			const instagramRow = new MessageActionRow().addComponents(instagramInput);
			const goodreadsRow = new MessageActionRow().addComponents(goodreadsInput);

			socialModal.addComponents(ao3Row, tumblrRow, twitterRow, instagramRow, goodreadsRow);

			await interaction.showModal(socialModal);
		});

	},
};