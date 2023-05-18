// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
require('dotenv').config();

// Keep bot running
const keep_alive = require('./keep_alive.js');

// Create a new client instance
const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages],
	partials: [User, Message, GuildMember, ThreadMember],
});

// All Collections
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();

// Get things running
const { loadEvents } = require('./Handlers/handleEvents.js');
const { loadCommands } = require('./Handlers/handleCommands.js');
const { dbLogin } = require('./Functions/dbLogin.js');

client.login(process.env.token).then(() => {
	loadEvents(client);
	loadCommands(client);
	dbLogin();
})
	.catch((err) => console.log(err));