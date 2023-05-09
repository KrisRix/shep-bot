const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('Tell me your fav color!'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('color-select')
					.setPlaceholder('Nothing is selected yet.')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions([
						{
							label: 'Red',
							description: 'Your fav color is red.',
							value: 'red',

						},
						{
							label: 'Orange',
							description: 'Your fav color is orange.',
							value: 'orange',

						},
						{
							label: 'Yellow',
							description: 'Your fav color is yellow.',
							value: 'yellow',

						},
						{
							label: 'Green',
							description: 'Your fav color is green.',
							value: 'green',

						},
						{
							label: 'Blue',
							description: 'Your fav color is blue.',
							value: 'blue',

						},
						{
							label: 'Purple',
							description: 'Your fav color is purple.',
							value: 'purple',

						},
						{
							label: 'Pink',
							description: 'Your fav color is pink.',
							value: 'pink',

						},
						{
							label: 'Brown',
							description: 'Your fav color is brown.',
							value: 'brown',

						},
						{
							label: 'White',
							description: 'Your fav color is white.',
							value: 'white',

						},
						{
							label: 'Black',
							description: 'Your fav color is black.',
							value: 'black',

						},
					]),
			);

		await interaction.reply({ content: 'What is your fav color?', components: [row] });
	},
};