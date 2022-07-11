const { SlashCommandBuilder } = require('@discordjs/builders');
const profileSchema = require('../../schemas/profile-schema');

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
		// Combine all socials
		const socialMedia = [ao3, tumblr, twitter];
		// Message to confirm input
		await interaction.reply(`Your profile info is: ${age}, ${socialMedia}`);
		// Update database
		await profileSchema.findOneAndUpdate({
			_id: interaction.guild.id,
			memberId: interaction.guild.member.id,
		},
		{
			_id: interaction.guild.id,
			memberId: interaction.guild.member.id,
			pronouns: 'placeholder',
			age,
			ao3,
			tumblr,
			twitter,
		}, {
			upsert: true,
		});
	},
};