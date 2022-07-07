const mongoose = require('mongoose');
const path = require('node:path');

module.exports = (client) => {
	client.dbLogin = async (mongoEventFiles, mongoEventsPath) => {
		for (const file of mongoEventFiles) {
			const filePath = path.join(mongoEventsPath, file);
			const event = require(filePath);
			if (event.once) {
				mongoose.connection.once(event.name, (...args) => event.execute(...args));
			}
			else {
				mongoose.connection.on(event.name, (...args) => event.execute(...args));
			}
		}
		mongoose.Promise = global.Promise;
		await mongoose.connect(process.env.dbToken, {});
	};
};