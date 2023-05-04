module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				if (command.permissions && command.permissions.length > 0) {
					if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: 'Sorry, bud, you don\'t have permission to use this command.', ephemeral: true });
				}
				await command.execute(interaction, client);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'Ope! There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
		else if (interaction.isSelectMenu()) {
			if (interaction.customId == 'color-select') {
				if (`${interaction.values}` == 'purple') {
					await interaction.reply({ content: 'Cool! Purple is Penny\'s favorite color, too!' });
				}
				else if (`${interaction.values}` == 'blue') {
					await interaction.reply({ content: 'Good choice. I think blue is Baz\'s fav, too. Or maybe it\'s purple...' });
				}
				else if (`${interaction.values}` == 'green') {
					await interaction.reply({ content: 'A solid choice! Simon looks great in green. He made a funny face when I said so, though...' });
				}
				else if (`${interaction.values}` == 'pink') {
					await interaction.reply({ content: 'Ooo, pink! That\'s the color of Simon and Baz\'s couch!' });
				}
				else if (`${interaction.values}` == 'yellow') {
					await interaction.reply({ content: 'That\'s an excellent choice. Penny looks amazing in yellow.' });
				}
				else {
					await interaction.reply({ content: `Whoa, your fav color is ${interaction.values}? Nice!` });
				}
			}
		}
		else if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);
			const buttonSpecial = ['confirm', 'cancel', 'adult', 'minor', 'ao3', 'tumblr', 'twitter', 'instagram', 'goodreads'];
			if (!button) {
				if (buttonSpecial.some(b => interaction.customId.includes(b))) {
					return;
				}
				else {
					await interaction.reply({ content: 'Sorry, pal, there was no button code found for this button.' });
				}
			}
			try {
				await button.execute(interaction, client);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'Ope! There was an error while executing this button.',
					ephemeral: true,
				});
			}
		}
	},
};