const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType } = require('discord.js');
const profileSchema = require('../../schemas/profile-schema');

const pronounsList = ['941035999339872337'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Sets a member\'s profile.')
		.addBooleanOption(option => option
			.setName('age')
			.setDescription('Are you over 18?')
			.setRequired(true))
		.addStringOption(option => option
			.setName('ao3')
			.setDescription('Your AO3 username'))
		.addStringOption(option => option
			.setName('tumblr')
			.setDescription('Your tumblr username'))
		.addStringOption(option => option
			.setName('twitter')
			.setDescription('Your twitter username'))
		.addStringOption(option => option
			.setName('instagram')
			.setDescription('Your instagram username'))
		.addStringOption(option => option
			.setName('goodreads')
			.setDescription('Your Goodreads username')),

	async execute(interaction, client) {
		const age = interaction.options.getBoolean('age') ? 'adult' : 'minor';
		const ao3 = interaction.options.getString('ao3') ? interaction.options.getString('ao3').trim() : 'N/A';
		const tumblr = interaction.options.getString('tumblr') ? interaction.options.getString('tumblr').trim() : 'N/A';
		const twitter = interaction.options.getString('twitter') ? interaction.options.getString('twitter').trim() : 'N/A';
		const instagram = interaction.options.getString('instagram') ? interaction.options.getString('instagram').trim() : 'N/A';
		const goodreads = interaction.options.getString('goodreads') ? interaction.options.getString('goodreads').trim() : 'N/A';

		// Find pronouns role
		let memberPronouns = interaction.member.roles.cache.find(role => pronounsList.includes(role.id));
		if (!memberPronouns) {
			memberPronouns = 'Not assigned';
		}

		// Embed with entered info
		await interaction.user.fetch();
		const member = await interaction.member.fetch();
		const profileEmbed = new EmbedBuilder()
			.setTitle(`${interaction.user.username}'s Profile`)
			.setThumbnail(member.displayAvatarURL())
			.addFields(
				{ name: 'Username:', value: `${interaction.user.username}`, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Member since:', value: `${member.joinedAt.toDateString()}`, inline: true },
			)
			.addFields(
				{ name: 'Pronouns:', value: `${memberPronouns}`, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Age:', value: `${age}`, inline: true },
			)
			.addFields(
				{ name: '<:social_ao3:747580432522149979> AO3', value: `[${ao3}](https://archiveofourown.org/users/${ao3})`, inline: true },
				{ name: '<:social_tumblr:796411846575652864> Tumblr', value: `[${tumblr}](https://${tumblr}.tumblr.com)`, inline: true },
				{ name: '<:social_twitter:796411914145234944> Twitter', value: `[${twitter}](https://twitter.com/${twitter})`, inline: true },
				{ name: '<:social_instagram:796412284120727572> Instagram', value: `[${instagram}](https://instagram.com/${instagram})`, inline: true },
				{ name: '<:social_goodreads:796473004632178698> Goodreads', value: `[${goodreads}](https://goodreads.com/${goodreads})`, inline: true },
			)
			.setImage(interaction.user.bannerURL({ dynamic: true, size: 1024 }))
			.setTimestamp()
			.setColor(interaction.user.accentColor)
			.setFooter({ text: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL()}` });

		// Message to confirm input
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('confirmProfile')
					.setLabel('Confirm')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('cancelProfile')
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Danger),
			);
    const response = await interaction.reply({
      content: `_*Here\'s the info I\'ve got about you:*_`,
      ephemeral: true,
      embeds: [profileEmbed],
      components: [row]
    });

		const collectorFilter = i => {
      return i.user.id === interaction.user.id;
    };


    try {
      const collector = await response.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.Button, time: 60000, max: 1 });
      collector.on('collect', async i => {
        if (i.customId === 'cancelProfile') {
          response.edit({ content: 'Profile setup cancelled.', components: [], embeds: [] });
          collector.stop('Collector stopped manually');
        }
        else if (i.customId === 'confirmProfile') {
          response.edit({ content: 'Profile setup confirmed!', components: [], embeds: [] });
          collector.stop('Collector stopped manually');
				// Update database
          await profileSchema.findOneAndUpdate({
            _id: interaction.guild.id,
					  memberId: interaction.member.id,
				  },
				  {
					  _id: interaction.guild.id,
					  memberId: interaction.member.id,
					  pronouns: memberPronouns,
					  age,
					  ao3,
					  tumblr,
					  twitter,
					  instagram,
					  goodreads,
				  }, {
					  upsert: true,
				  });
			  }
      });
      collector.on('end', (collected, reason) => {
        if (reason && reason === 'Collector stopped manually') {
          console.log('Collector has been stopped manually');
        } else {
          console.log('Collector has NOT been stopped manually');
          response.edit({ content: `I didn't receive your confirmation within 1 minute, so I cancelled it.`, components: [], embeds: [] });
      }
});
    } catch (e) {
      console.log(e);
    }
	},
};