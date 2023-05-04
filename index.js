// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
require('dotenv').config();

// Keep bot running
const keep_alive = require('./keep_alive.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Function handling
const functionsPath = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));

// Event handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Command handling
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Button handling
const buttonsPath = path.join(__dirname, 'buttons');
const buttonsFolder = fs.readdirSync(buttonsPath);

// Database handling
const mongoEventsPath = path.join(__dirname, 'mongoEvents');
const mongoEventFiles = fs.readdirSync(mongoEventsPath).filter(file => file.endsWith('.js'));

// All commands
client.commands = new Collection();
// All buttons
client.buttons = new Collection();

(async () => {
	// Read handlers
	for (const file of functionFiles) {
		const filePath = path.join(functionsPath, file);
		require(filePath)(client);
	}
	// Initiate handlers
	client.handleEvents(eventFiles, eventsPath);
	client.handleCommands(commandFolders, commandsPath);
	client.handleButtons(buttonsFolder, buttonsPath);
	// Login to Discord with client's token
	client.login(process.env.token);
	// Connect to database
	client.dbLogin(mongoEventFiles, mongoEventsPath);
})();