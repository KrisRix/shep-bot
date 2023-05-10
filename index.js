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
// client.subCommands = new Collection();
// client.guildConfig = new Collection();
// client.buttons = new Collection();

const { loadEvents } = require('./Handlers/handleEvents.js');
loadEvents(client);

client
	.login(process.env.token)
	.catch((err) => console.log(err));