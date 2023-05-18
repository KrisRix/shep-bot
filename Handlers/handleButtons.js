const { loadFiles } = require('../Functions/fileLoader');

module.exports = (client) => {
	client.handleButtons = async () => {
		const files = await loadFiles('Buttons');

		for (const file of files) {

			const button = require(file);
			// set a new button in the Collection
			// with the key as the command name and the value as the exported module
			client.buttons.set(button.data.name, button);
		}
	};
};