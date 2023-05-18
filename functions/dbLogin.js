const mongoose = require('mongoose');
const { loadFiles } = require('../Functions/fileLoader');

async function dbLogin() {

	const files = await loadFiles('mongoEvents');

	for (const file of files) {
		const event = require(file);
		if (event.once) {
			mongoose.connection.once(event.name, (...args) => event.execute(...args));
		}
		else {
			mongoose.connection.on(event.name, (...args) => event.execute(...args));
		}
	}
	mongoose.Promise = global.Promise;
	await mongoose.connect(process.env.dbToken, {
		keepAlive: true,
	});
}

module.exports = { dbLogin };