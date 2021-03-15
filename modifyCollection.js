/* This script could really be used to modify / delete / add any fields to the database, you just need to use a different function and change the arguments
 * TODO: allow command line arguments to modify any arbitrary database (or maybe have an "all" option to modify every database...) 
 * ****** HOW TO USE THIS SCRIPT ***********
 * Enter the command "node modifyCollection.js <Database name> <collection name> 
 * If you want to make the same collection modification to each company, you can use node modifyCollection.js <all> <collection name>
 * If the name of the collection is separated by a space (like 'Employees Database') you need to enter it like so: 'Employees\ Database'
 * Before running the script, you need to change the modifyEntries function to actually do anything */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const uri = "mongodb+srv://user:cs320team1@cs320.t0mlm.mongodb.net/outback-tech?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
	const args = process.argv.slice(2);
	console.log(args);
	const company = args[0];
	const collection = args[1];
	assert.equal(err, null);
	const db = client.db(company);
	const kudos = db.collection(collection);
	const modifyKudos = async () => {
		// ************ ONLY CHANGE THINGS BETWEEN THESE CURLY BRACES *************** 
	}
	modifyKudos();
});
