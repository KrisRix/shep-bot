const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle } = require('discord.js');
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
	

			// Next message: setting socials
			const socialModal = new ModalBuilder()
				.setCustomId('socials')
				.setTitle(`${interaction.user}'s Socials`);
			const ao3Input = new TextInputBuilder()
				.setCustomId('ao3')
				.setLabel('Link your AO3 account')
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
				.setCustomId('Goodreads')
				.setLabel('Link your Goodreads page')
				.setStyle(TextInputStyle.Short);
			const ao3Row = new ActionRowBuilder().addComponents(ao3Input);
			const tumblrRow = new ActionRowBuilder().addComponents(tumblrInput);
			const twitterRow = new ActionRowBuilder().addComponents(twitterInput);
			const instagramRow = new ActionRowBuilder().addComponents(instagramInput);
			const goodreadsRow = new ActionRowBuilder().addComponents(goodreadsInput);

			socialModal.addComponents(ao3Row, tumblrRow, twitterRow, instagramRow, goodreadsRow);

			await interaction.showModal(socialModal);

      // First message: setting age
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
		})
      
	}
};