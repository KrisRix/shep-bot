const { SlashCommandBuilder } = require('@discordjs/builders');
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
	async execute(interaction) {
		const age = interaction.options.getBoolean('age');
		const ao3 = interaction.options.getString('ao3') ? interaction.options.getString('ao3') : 'N/A';
		const tumblr = interaction.options.getString('tumblr') ? interaction.options.getString('tumblr') : 'N/A';
		const twitter = interaction.options.getString('twitter') ? interaction.options.getString('twitter') : 'N/A';
		const instagram = interaction.options.getString('instagram') ? interaction.options.getString('instagram') : 'N/A';
		const goodreads = interaction.options.getString('goodreads') ? interaction.options.getString('goodreads') : 'N/A';

		// Find pronouns role
		let memberPronouns = interaction.member.roles.cache.find(role => pronounsList.includes(role.id));
		if (!memberPronouns) {
			memberPronouns = 'Not assigned';
		}
		// Message to confirm input
		await interaction.reply({
			content: `_*Here's the info I've got about you:*_
			\n**Name:** ${interaction.member}
			\n**Pronouns:** ${memberPronouns}
			\n**Age:** ${age}
			\n**AO3:** ${ao3}
			\n**Tumblr:** ${tumblr}
			\n**Twitter:** ${twitter}
			\n**Instagram:** ${instagram}
			\n**Goodreads:** ${goodreads}`,
			ephemeral: false,
		});

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
	},
};