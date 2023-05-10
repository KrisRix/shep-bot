const { loadFiles } = require('../Functions/fileLoader');

async function loadCommands(client) {
	console.time('Commands loaded.');

	client.commands = new Map();
	const commandsArray = new Array();
	const commandsLog = new Array();

	const files = await loadFiles('Commands');

	for (const file of files) {
		try {
			const command = require(file);

			client.commands.set(command.data.name, command);

			commandsArray.push(command.data.toJSON());
			commandsLog.push({ Command: command.data.name, Status: '✅' });
		}
		catch (error) {
			commandsLog.push({ Command: file.split('/').pop().slice(0, -3), Status: '🛑' });
		}
	}

	client.application.commands.set(commandsArray);

	console.table(commandsLog, ['Command', 'Status']);
	console.info('\n\x1b[36m%s\x1b[0m', 'Loaded Commands.');
	console.timeEnd('Commands loaded.');

}

module.exports = { loadCommands };