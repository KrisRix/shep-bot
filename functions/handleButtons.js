const path = require('node:path');
const fs = require('node:fs');

module.exports = (client) => {
	client.handleButtons = async (buttonsFolder, buttonsPath) => {
		for (const folder of buttonsFolder) {
			const buttonFolder = path.join(buttonsPath, folder);
			const buttonsFiles = fs.readdirSync(buttonFolder).filter(file => file.endsWith('.js'));
			for (const file of buttonsFiles) {
				const buttonPath = path.join(buttonFolder, file);
				const button = require(buttonPath);
				// set a new button in the Collection
				// with the key as the command name and the value as the exported module
				client.buttons.set(button.data.name, button);
			}
		}
	};
};