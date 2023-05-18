const fs = require('node:fs');
const path = require('node:path');

async function loadCommands(client) {
	console.time('Commands loading time');

	const commandsLog = new Array();

	const foldersPath = path.join(__dirname, '../Commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			try {
				const command = require(filePath);
				// Set a new item in the Collection with the key as the command name and the value as the exported module
				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
					commandsLog.push({ Command: command.data.name, Status: '✅' });
				}
				else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			}
			catch (error) {
				commandsLog.push({ Command: file.split('/').pop().slice(0, -3), Status: '🛑' });
			}
		}
	}

	// Logging
	console.table(commandsLog, ['Command', 'Status']);
	console.info('\n\x1b[36m%s\x1b[0m', 'Loaded Commands.');
	console.timeEnd('Commands loading time');

}

module.exports = { loadCommands };