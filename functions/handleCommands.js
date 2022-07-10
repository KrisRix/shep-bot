const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const path = require('node:path');
const fs = require('node:fs');
const clientId = '994283157119586345';
const guildId = '797598372839292978';

module.exports = (client) => {
	client.handleCommands = async (commandFolders, commandsPath) => {
		client.commandArray = [];
		for (const folder of commandFolders) {
			const commandFolder = path.join(commandsPath, folder);
			const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const commandPath = path.join(commandFolder, file);
				const command = require(commandPath);
				// set a new item in the Collection
				// with the key as the command name and the value as the exported module
				client.commands.set(command.data.name, command);
				client.commandArray.push(command.data.toJSON());
			}
		}
		const rest = new REST({
			version: '9',
		}).setToken(process.env.token);

		// Load slash commands
		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId), {
						body: client.commandArray,
					},
				);
				console.log('Successfully reloaded application (/) commands.');
			}
			catch (error) {
				console.error(error);
			}
		})();

	};
};