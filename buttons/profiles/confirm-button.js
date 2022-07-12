const profileSchema = require('../../schemas/profile-schema');

module.exports = {
	data: {
		name: 'confirm-button',
	},
	async execute(interaction, memberPronouns, age, ao3, tumblr, twitter, instagram, goodreads) {
		await interaction.reply('Your profile is set!');

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