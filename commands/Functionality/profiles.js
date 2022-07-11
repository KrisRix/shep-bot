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
			.setDescription('Your AO3 username')
			.setRequired(true))
		.addStringOption(option => option
			.setName('tumblr')
			.setDescription('Your tumblr username'))
		.addStringOption(option => option
			.setName('twitter')
			.setDescription('Your twitter username')),
	async execute(interaction) {
		const age = interaction.options.getBoolean('age');
		const ao3 = interaction.options.getString('ao3') ? interaction.options.getString('ao3') : 'N/A';
		const tumblr = interaction.options.getString('tumblr') ? interaction.options.getString('tumblr') : 'N/A';
		const twitter = interaction.options.getString('twitter') ? interaction.options.getString('twitter') : 'N/A';
		// Find pronouns role
		let memberPronouns;
		for (const pronoun in pronounsList) {
			if (interaction.member.roles.cache.has(pronoun)) {
				memberPronouns = pronoun;
			}
			else {
				memberPronouns = 'Not assigned';
			}
		}
		// Message to confirm input
		await interaction.reply(`Your profile info is: ${memberPronouns}`);
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
		}, {
			upsert: true,
		});
	},
};