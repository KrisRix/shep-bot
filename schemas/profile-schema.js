const { mongoose, Schema } = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const profileSchema = new Schema({
	// Guild ID
	_id: reqString,
	memberId: reqString,
	pronouns: reqString,
	age: String,
	ao3: String,
	tumblr: String,
	twitter: String,
	instagram: String,
	goodreads: String,
});

const name = 'member-profiles';

module.exports =
	mongoose.models[name] || mongoose.model(name, profileSchema);