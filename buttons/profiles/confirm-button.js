const profileSchema = require('../../schemas/profile-schema');
const { memberPronouns, age, ao3, tumblr, twitter, instagram, goodreads } = require('../../commands/Functionality/profiles');

module.exports = {
	data: {
		name: 'confirm-button',
	},
	async execute(interaction) {
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