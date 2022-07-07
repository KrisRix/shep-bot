// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Function handling
const functionsPath = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));

// Event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Command handling
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Database handling
const mongoEventsPath = path.join(__dirname, 'mongoEvents');
const mongoEventFiles = fs.readdirSync(mongoEventsPath).filter(file => file.endsWith('.js'));

// All commands
client.commands = new Collection();

(async () => {
	// Read handlers
	for (const file of functionFiles) {
		const filePath = path.join(functionsPath, file);
		require(filePath)(client);
	}
	// Initiate handlers
	client.handleEvents(eventFiles, eventsPath);
	client.handleCommands(commandFolders, commandsPath);
	// Login to Discord with client's token
	client.login(process.env.token);
	// Connect to database
	client.dbLogin(mongoEventFiles, mongoEventsPath);
})();